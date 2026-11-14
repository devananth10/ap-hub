"""Isolated Docker CLI simulations for the Pi release preparation helper."""
import contextlib
import copy
import importlib.util
import io
import json
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("pi_release", root / "scripts/prepare-pi-release.py")
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)
image = "api.repoflow.io/prepatlas/prepatlas/studyhub-app@sha256:" + "a" * 64


class ReleasePreparationTests(unittest.TestCase):
    def setUp(self):
        self.calls = []
        self.current = "prepatlas-new"
        self.existing = "prepatlas-new\n"
        self.old = {
            "Id": "a" * 64,
            "State": {"Running": True},
            "Config": {"Env": ["APP_ORIGIN=https://prepatlas.app", "APP_REGISTRATION_ENABLED=false",
                               "AUTH_FLOW_SECRET=sample-private-test-data"]},
            "Mounts": [{"Type": "volume", "Name": "studyhub_feedback", "Destination": "/app/data", "RW": True}],
            "HostConfig": {
                "NetworkMode": "default", "Init": True, "CapDrop": ["ALL"],
                "SecurityOpt": ["no-new-privileges:true"], "RestartPolicy": {"Name": "unless-stopped"},
                "PortBindings": {"3000/tcp": [{"HostIp": "127.0.0.1", "HostPort": "3001"},
                                              {"HostIp": "192.168.1.20", "HostPort": "3001"}]},
            },
            "NetworkSettings": {"Networks": {"bridge": {"Aliases": None}}},
        }

    def run_docker(self, arguments, **options):
        self.calls.append((arguments[1:], options))
        command = arguments[1:]
        if command[:2] == ["container", "ls"]:
            output = self.existing
        elif command == ["inspect", self.current]:
            output = json.dumps([self.old])
        elif command[:2] == ["image", "inspect"]:
            output = json.dumps([{"Architecture": "arm64", "Os": "linux"}])
        else:
            output = "sample-new-container-id"
        return subprocess.CompletedProcess(arguments, 0, stdout=output)

    def prepare(self):
        with patch.object(release.shutil, "which", return_value="/usr/bin/docker"), \
                patch.object(release.Path, "is_file", return_value=True), \
                patch.object(release.subprocess, "run", side_effect=self.run_docker), \
                contextlib.redirect_stdout(io.StringIO()):
            release.prepare(image, "prepatlas-release-test", current=self.current)

    def test_stopped_release_keeps_ports_volume_environment_and_security(self):
        self.prepare()
        create, options = next(call for call in self.calls if call[0][0] == "create")
        self.assertIn("127.0.0.1:3001:3000/tcp", create)
        self.assertIn("192.168.1.20:3001:3000/tcp", create)
        for flag, value in [("--env-file", "/home/admin/.env.local"), ("--volumes-from", "prepatlas-new"),
                            ("--restart", "unless-stopped"), ("--cap-drop", "ALL")]:
            self.assertEqual(create[create.index(flag) + 1], value)
        self.assertNotIn("sample-private-test-data", " ".join(create))
        self.assertEqual(options["env"]["AUTH_FLOW_SECRET"], "sample-private-test-data")
        self.assertEqual(options["env"]["APP_REGISTRATION_ENABLED"], "false")
        self.assertTrue(all(call[0][0] not in ("stop", "start", "rm", "run") for call in self.calls))
        self.assertFalse(any(call[0][:2] == ["network", "connect"] for call in self.calls))

    def test_ipv6_and_existing_network_aliases_are_preserved(self):
        self.old["HostConfig"]["NetworkMode"] = "app-network"
        self.old["HostConfig"]["PortBindings"]["3000/tcp"] = [{"HostIp": "::1", "HostPort": "3001"}]
        self.old["NetworkSettings"]["Networks"] = {
            "app-network": {"Aliases": ["prepatlas-new", "a" * 12]},
            "tunnel-network": {"Aliases": ["prepatlas-app"]},
        }
        self.prepare()
        create = next(call[0] for call in self.calls if call[0][0] == "create")
        self.assertIn("[::1]:3001:3000/tcp", create)
        self.assertIn("prepatlas-new", create)
        self.assertIn(["network", "connect", "--alias", "prepatlas-app", "tunnel-network", "prepatlas-release-test"],
                      [call[0] for call in self.calls])

    def test_mismatched_origin_registration_volume_or_stopped_app_prevents_creation(self):
        original = copy.deepcopy(self.old)
        cases = [
            lambda old: old["Config"]["Env"].__setitem__(0, "APP_ORIGIN=http://127.0.0.1:3001"),
            lambda old: old["Config"]["Env"].__setitem__(1, "APP_REGISTRATION_ENABLED=true"),
            lambda old: old["Mounts"].clear(),
            lambda old: old["State"].update(Running=False),
        ]
        for change in cases:
            with self.subTest(change=change):
                self.old = copy.deepcopy(original)
                self.calls = []
                change(self.old)
                with self.assertRaises(RuntimeError):
                    self.prepare()
                self.assertFalse(any(call[0][0] == "create" for call in self.calls))

    def test_existing_release_name_is_never_replaced(self):
        self.existing += "prepatlas-release-test\n"
        with self.assertRaises(RuntimeError):
            self.prepare()
        self.assertEqual(len(self.calls), 1)

    def test_explicit_current_release_is_inspected_and_used_for_all_mounts(self):
        self.current = "prepatlas-release-0a2bca1"
        self.existing = self.current + "\nprepatlas-new\n"
        self.prepare()
        commands = [call[0] for call in self.calls]
        self.assertIn(["inspect", self.current], commands)
        self.assertNotIn(["inspect", "prepatlas-new"], commands)
        create = next(command for command in commands if command[0] == "create")
        self.assertEqual(create[create.index("--volumes-from") + 1], self.current)
        self.assertEqual(len([argument for argument in create if argument == "--publish"]), 2)


if __name__ == "__main__":
    unittest.main()
