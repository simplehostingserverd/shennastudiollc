#!/usr/bin/env python3
"""
Apply Railway variables using the serene-presence pattern.
This script automates the variable setting process.
"""

import subprocess
import json
import sys
import time


def run_command(cmd):
    """Run a command and return success status"""
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True, timeout=30
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)


def apply_variables(service_name, json_file):
    """Apply variables from JSON file to a Railway service"""
    print(f"\n{'=' * 60}")
    print(f"Applying {service_name} Variables")
    print(f"{'=' * 60}\n")

    # Read JSON file
    try:
        with open(json_file, "r") as f:
            variables = json.load(f)
    except Exception as e:
        print(f"❌ Error reading {json_file}: {e}")
        return False

    # Filter out comments
    variables = {k: v for k, v in variables.items() if not k.startswith("comment")}

    print(f"Found {len(variables)} variables to set\n")

    # Switch to service
    print(f"Switching to {service_name} service...")
    success, stdout, stderr = run_command(f"railway service {service_name}")
    if not success:
        print(f"❌ Failed to switch to {service_name}: {stderr}")
        return False

    # Apply each variable
    success_count = 0
    failed_count = 0

    for key, value in variables.items():
        # Escape special characters for shell
        escaped_value = value.replace('"', '\\"').replace("$", "\\$")
        cmd = f'railway variables --set "{key}={escaped_value}" --skip-deploys'

        print(f"  Setting {key}...", end=" ")
        success, stdout, stderr = run_command(cmd)

        if success:
            print("✓")
            success_count += 1
        else:
            print(f"✗ ({stderr.strip()})")
            failed_count += 1

        # Small delay to avoid rate limiting
        time.sleep(0.2)

    print(f"\n✓ Applied {success_count} variables")
    if failed_count > 0:
        print(f"✗ Failed to apply {failed_count} variables")

    return failed_count == 0


def main():
    print("=" * 60)
    print("Railway Variable Deployment")
    print("Serene-Presence Pattern + Your Values")
    print("=" * 60)
    print()

    project_dir = "/Users/softwareprosorg/Documents/NewShenna/shennastudiollc"

    # Check if Railway CLI is available
    success, _, _ = run_command("railway --version")
    if not success:
        print("❌ Railway CLI not found. Please install it first:")
        print("   npm install -g @railway/cli")
        return 1

    print("✓ Railway CLI found\n")

    # Check if linked to a project
    success, stdout, stderr = run_command("railway status")
    if "No linked project" in stderr or "No linked project" in stdout:
        print("⚠️  Not linked to a Railway project")
        print("\nPlease run manually:")
        print("  cd", project_dir)
        print("  railway link")
        print("\nThen run this script again.")
        return 1

    print("✓ Linked to Railway project\n")
    print(stdout)

    # Apply Backend variables
    backend_json = (
        f"{project_dir}/ocean-backend/railway-backend-serene-pattern.env.json"
    )
    if not apply_variables("Backend", backend_json):
        print("\n⚠️  Some backend variables failed to apply")

    # Apply Frontend variables
    frontend_json = f"{project_dir}/railway-frontend-serene-pattern.env.json"
    if not apply_variables("Storefront", frontend_json):
        print("\n⚠️  Some frontend variables failed to apply")

    # Ask about deployment
    print("\n" + "=" * 60)
    print("Variables Applied Successfully!")
    print("=" * 60)
    print()
    print("Would you like to deploy the services now? (y/n): ", end="")

    try:
        response = input().strip().lower()
        if response in ["y", "yes"]:
            print("\nDeploying Backend...")
            run_command("railway service Backend")
            success, stdout, stderr = run_command("railway up")
            if success:
                print("✓ Backend deployment triggered")
            else:
                print(f"✗ Backend deployment failed: {stderr}")

            print("\nDeploying Storefront...")
            run_command("railway service Storefront")
            success, stdout, stderr = run_command("railway up")
            if success:
                print("✓ Storefront deployment triggered")
            else:
                print(f"✗ Storefront deployment failed: {stderr}")
    except KeyboardInterrupt:
        print("\n\nDeployment skipped")

    print("\n" + "=" * 60)
    print("✅ Complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Monitor deployments in Railway dashboard")
    print("2. Check Backend: https://api.shennastudio.com/health")
    print("3. Check Frontend: https://shennastudio.com")
    print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
