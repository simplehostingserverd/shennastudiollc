#!/usr/bin/env python3
"""
Interactive script to import Railway variables from serene-presence.
Since the Railway CLI has issues with interactive prompts, this script
will help you manually paste the variables from the Railway dashboard.
"""

import json
import sys
import os


def main():
    print("=" * 70)
    print("Railway Variable Importer - Serene-Presence to Local")
    print("=" * 70)
    print()
    print("This script will help you import the environment variables from")
    print("your working Railway deployment (serene-presence) to this project.")
    print()
    print("INSTRUCTIONS:")
    print()
    print("1. Open Railway dashboard: https://railway.app/dashboard")
    print("2. Navigate to: serene-presence > production > Storefront")
    print("3. Click on the 'Variables' tab")
    print("4. Copy ALL the variables (you can use the copy button)")
    print()
    print("=" * 70)
    print()

    print("Please paste the variables below in KEY=VALUE format")
    print("(one per line, press Ctrl+D or Enter on empty line when done):")
    print()

    variables = {}

    try:
        while True:
            line = input().strip()
            if not line:
                break

            if "=" in line:
                key, value = line.split("=", 1)
                variables[key.strip()] = value.strip()
            else:
                print(f"⚠️  Skipping invalid line: {line}")

    except EOFError:
        pass

    print()
    print("=" * 70)
    print(f"Imported {len(variables)} variables")
    print("=" * 70)
    print()

    if not variables:
        print("❌ No variables imported. Please try again.")
        return 1

    # Show what we got
    print("Variables found:")
    for key in sorted(variables.keys()):
        value_preview = (
            variables[key][:50] + "..." if len(variables[key]) > 50 else variables[key]
        )
        print(f"  ✓ {key} = {value_preview}")

    print()

    # Save to JSON
    output_file = "/Users/softwareprosorg/Documents/NewShenna/shennastudiollc/serene-storefront-vars.json"

    with open(output_file, "w") as f:
        json.dump(variables, f, indent=2)

    print(f"✓ Saved to: {output_file}")
    print()

    # Now create updated .env files
    print("Creating updated .env files...")
    print()

    # Create .env.production with the Railway values
    env_production = f"""# Production Environment Variables for Shenna's Studio
# Updated from serene-presence Railway deployment

# Backend API Configuration (Production)
NEXT_PUBLIC_MEDUSA_BACKEND_URL={variables.get("NEXT_PUBLIC_MEDUSA_BACKEND_URL", "https://api.shennastudio.com")}
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY={variables.get("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY", "")}

# Stripe Configuration
STRIPE_SECRET_KEY={variables.get("STRIPE_SECRET_KEY", "")}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY={variables.get("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "")}

# NextAuth Configuration
NEXTAUTH_SECRET={variables.get("NEXTAUTH_SECRET", "")}
NEXTAUTH_URL={variables.get("NEXTAUTH_URL", "https://shennastudio.com")}

# Environment
NODE_ENV={variables.get("NODE_ENV", "production")}
NEXT_TELEMETRY_DISABLED={variables.get("NEXT_TELEMETRY_DISABLED", "1")}

# Server Configuration (for Railway)
HOSTNAME={variables.get("HOSTNAME", "0.0.0.0")}
PORT={variables.get("PORT", "3000")}
"""

    env_prod_file = (
        "/Users/softwareprosorg/Documents/NewShenna/shennastudiollc/.env.production.new"
    )
    with open(env_prod_file, "w") as f:
        f.write(env_production)

    print(f"✓ Created: .env.production.new")
    print()
    print("=" * 70)
    print("✅ Import complete!")
    print("=" * 70)
    print()
    print("Next steps:")
    print("1. Review the new .env.production.new file")
    print("2. If it looks good, rename it to .env.production")
    print("3. Update your Railway deployment with these variables")
    print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
