#!/usr/bin/env python3
"""Create a stopped Pi release beside the running app, retaining its configuration."""
import argparse
import json
import os
import re
import shutil
import subprocess
from pathlib import Path


def prepare(image, name, current="prepatlas-new", env_file="/home/admin/.env.local"):
    docker = shutil.which("docker")
    if not docker:
        raise RuntimeError("Docker is unavailable.")

    def command(arguments, operation, environment=None):
        result = subprocess.run(
            [docker, *arguments], capture_output=True, text=True, env=environment
        )
        if result.returncode:
            raise RuntimeError("Docker failed while " + operation + ".")
        return result.stdout

    if not re.fullmatch(
        r"api\.repoflow\.io/prepatlas/prepatlas/studyhub-app@sha256:[0-9a-f]{64}", image
    ):
        raise RuntimeError("Use the verified immutable RepoFlow image digest.")
    if not re.fullmatch(r"prepatlas-[a-zA-Z0-9_.-]+", name) or name == current:
        raise RuntimeError("Choose a distinct PrepAtlas release container name.")
    if not Path(env_file).is_file():
        raise RuntimeError("The existing production environment file is missing.")

    existing = command(["container", "ls", "-a", "--format", "{{.Names}}"], "listing containers")
    if name in existing.splitlines():
        raise RuntimeError("The release container name already exists. Nothing was replaced.")
    old = json.loads(command(["inspect", current], "inspecting the current app"))[0]
    if not old["State"]["Running"]:
        raise RuntimeError("The current production container is not running.")
    if old["HostConfig"].get("AutoRemove"):
        raise RuntimeError("The current container uses auto-remove. Review rollback first.")
    mounts = old.get("Mounts", [])
    if not any(
        mount.get("Type") == "volume"
        and mount.get("Name") == "studyhub_feedback"
        and mount.get("Destination") == "/app/data"
        and mount.get("RW")
        for mount in mounts
    ):
        raise RuntimeError("The expected writable feedback volume was not found.")

    image_info = json.loads(command(["image", "inspect", image], "verifying the release image"))[0]
    if image_info["Architecture"] != "arm64" or image_info["Os"] != "linux":
        raise RuntimeError("The release image must be Linux ARM64.")

    # Docker copies --env NAME from the child process environment. Values never
    # appear in command arguments, printed output, or additional files.
    environment = os.environ.copy()
    entries = {}
    for entry in old["Config"].get("Env", []):
        key, value = entry.split("=", 1)
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", key):
            raise RuntimeError("An environment variable name needs manual review.")
        entries[key] = value
    if entries.get("APP_ORIGIN") != "https://prepatlas.app":
        raise RuntimeError("The current APP_ORIGIN needs review before this UI-only update.")
    if entries.get("APP_REGISTRATION_ENABLED") != "false":
        raise RuntimeError("Confirm APP_REGISTRATION_ENABLED is false before updating.")
    environment.update(entries)

    host = old["HostConfig"]
    network = host.get("NetworkMode", "default")
    if network in ("host", "none") or network.startswith("container:"):
        raise RuntimeError("This network mode needs a reviewed deployment command.")
    args = ["create", "--name", name, "--platform", "linux/arm64", "--network", network,
            "--env-file", env_file, "--volumes-from", current]
    for key in entries:
        args += ["--env", key]
    bindings = host.get("PortBindings") or {}
    if not bindings:
        raise RuntimeError("No existing published ports were found.")
    for container_port, destinations in bindings.items():
        for destination in destinations or []:
            ip = destination.get("HostIp", "")
            port = destination.get("HostPort", "")
            if not port.isdigit():
                raise RuntimeError("An existing port mapping needs manual review.")
            address = "[" + ip + "]" if ":" in ip else ip
            mapping = (address + ":" if address else "") + port + ":" + container_port
            args += ["--publish", mapping]
    restart = host.get("RestartPolicy") or {}
    policy = restart.get("Name", "no")
    if policy == "on-failure" and restart.get("MaximumRetryCount"):
        policy += ":" + str(restart["MaximumRetryCount"])
    args += ["--restart", policy]
    if host.get("Init"):
        args += ["--init"]
    for option in host.get("CapDrop") or []:
        args += ["--cap-drop", option]
    for option in host.get("CapAdd") or []:
        args += ["--cap-add", option]
    for option in host.get("SecurityOpt") or []:
        args += ["--security-opt", option]
    if host.get("Privileged"):
        raise RuntimeError("A privileged container needs manual review.")
    if host.get("ReadonlyRootfs"):
        args += ["--read-only"]
    networks = old.get("NetworkSettings", {}).get("Networks", {})
    primary = next((key for key, value in networks.items()
                    if key == network or value.get("NetworkID") == network
                    or (network == "default" and key == "bridge")), None)
    if primary and primary not in ("bridge", "host", "none"):
        for alias in networks[primary].get("Aliases") or []:
            if alias != old["Id"][:12]:
                args += ["--network-alias", alias]
    args += [image]
    command(args, "creating the stopped release", environment)
    for extra, settings in networks.items():
        if extra == primary:
            continue
        connect = ["network", "connect"]
        for alias in settings.get("Aliases") or []:
            if alias != old["Id"][:12]:
                connect += ["--alias", alias]
        command([*connect, extra, name], "attaching the existing app network")
    print("Prepared stopped release " + name + ". The current app is still running.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", help="Verified registry image pinned by digest")
    parser.add_argument("name", help="New, unique container name")
    arguments = parser.parse_args()
    try:
        prepare(arguments.image, arguments.name)
    except RuntimeError as error:
        raise SystemExit(str(error) + " Production was not stopped.")
    except (ValueError, KeyError, OSError):
        # Avoid exposing command output or environment values in a traceback.
        raise SystemExit("Preparation stopped. Check the image, existing container, ports, volume and environment requirements locally. Production was not stopped.")
