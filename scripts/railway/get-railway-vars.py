#!/usr/bin/env python3
"""
Script to extract environment variables from Railway's serene-presence project.
This will create .env files with the correct configuration from the working deployment.
"""

import subprocess
import json
import sys
import os

def run_command(cmd, cwd=None):
    """Run a shell command and return output"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            cwd=cwd
        )
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except Exception as e:
        return "", str(e), 1

def main():
    print("=" * 60)
    print("Railway Serene-Presence Variable Extractor")
    print("=" * 60)
    print()

    # Create temp directory
    temp_dir = "/tmp/railway-serene-extract"
    os.makedirs(temp_dir, exist_ok=True)

    print(f"Working in: {temp_dir}")
    print()

    # Step 1: Try to get variables using Railway CLI
    print("Step 1: Attempting to extract variables from serene-presence...")
    print()

    # This requires manual linking first
    print("MANUAL STEPS REQUIRED:")
    print()
    print("1. Open a new terminal window")
    print("2. Run: cd /tmp/railway-serene-extract")
    print("3. Run: railway link")
    print("   - Select: Simple Hosting Server's Projects")
    print("   - Select: serene-presence")
    print("   - Select: production")
    print("   - Select: Storefront")
    print()
    print("4. Run: railway variables --json > storefront-vars.json")
    print()
    print("5. Run: railway service Backend")
    print("6. Run: railway variables --json > backend-vars.json")
    print()
    print("7. Come back here and press Enter when done")
    print()

    input("Press Enter once you've completed the manual steps...")

    # Try to read the extracted files
    storefront_vars_file = os.path.join(temp_dir, "storefront-vars.json")
    backend_vars_file = os.path.join(temp_dir, "backend-vars.json")

    if os.path.exists(storefront_vars_file):
        print("\n✓ Found storefront-vars.json")
        with open(storefront_vars_file, 'r') as f:
            storefront_vars = json.load(f)
            print(f"  Found {len(storefront_vars)} variables")
    else:
        print("\n✗ Could not find storefront-vars.json")
        storefront_vars = {}

    if os.path.exists(backend_vars_file):
        print("✓ Found backend-vars.json")
        with open(backend_vars_file, 'r') as f:
            backend_vars = json.load(f)
            print(f"  Found {len(backend_vars)} variables")
    else:
        print("✗ Could not find backend-vars.json")
        backend_vars = {}

    # Save to project directory
    project_dir = "/Users/softwareprosorg/Documents/NewShenna/shennastudiollc"

    if storefront_vars:
        output_file = os.path.join(project_dir, "serene-storefront-vars.json")
        with open(output_file, 'w') as f:
            json.dump(storefront_vars, f, indent=2)
        print(f"\n✓ Saved storefront variables to: {output_file}")

    if backend_vars:
        output_file = os.path.join(project_dir, "serene-backend-vars.json")
        with open(output_file, 'w') as f:
            json.dump(backend_vars, f, indent=2)
        print(f"✓ Saved backend variables to: {output_file}")

    print("\n" + "=" * 60)
    print("Extraction complete!")
    print("=" * 60)

    if storefront_vars:
        print("\nFrontend variables found:")
        for key in sorted(storefront_vars.keys()):
            print(f"  - {key}")

    return 0

if __name__ == "__main__":
    sys.exit(main())
