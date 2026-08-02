# mainrepo

apt repo for cydia / sileo / zebra, three suites: stable, beta, staging.
built with [repotool](https://github.com/PlayDay-iOS/repo), deployed via github actions to github pages.

## one-time setup

1. rename this repo on github to whatever you want (subfolder hosting) or `yourusername.github.io` (root hosting).
2. edit `repo.toml`:
   - set `repo.url` to your actual pages url, matching whichever you picked above
   - set `github.org_name` to your github username/org
3. settings -> pages -> source: **github actions**
4. add your icon at `resources/CydiaIcon.png` (512x512 png recommended)

## signing (gpg)

generate a key if you don't have one:

```bash
gpg --full-generate-key
# choose RSA, 4096, no expiry or long expiry, your name/email
gpg --armor --export-secret-keys YOUR_KEY_ID > private.asc
```

in github: settings -> secrets and variables -> actions, add:

- `GPG_PRIVATE_KEY` — paste the full contents of `private.asc`
- `GPG_PASSPHRASE` — the passphrase you set (leave empty as a secret with no value if you didn't set one, or omit the secret entirely and repotool skips signing)

delete `private.asc` locally after, don't commit it. export your public key too:

```bash
gpg --armor --export YOUR_KEY_ID > repo-public.key
```

drop `repo-public.key` at the repo root and commit it — repotool will link it from the landing page automatically so users can import it.

## adding packages

drop a `.deb` into the right suite:

```
pool/stable/main/yourtweak_1.0_iphoneos-arm64.deb
pool/beta/main/yourtweak_1.1-beta1_iphoneos-arm64.deb
pool/staging/main/yourtweak_1.2-dev_iphoneos-arm64.deb
```

commit and push to `main`. actions rebuilds `Packages`, `Release`, `InRelease`, and per-package depiction pages automatically. nothing to run locally.

## adding this repo in cydia/sileo/zebra

give users whichever of these they want:

```
deb https://yourusername.github.io/repo/stable/ ./
deb https://yourusername.github.io/repo/beta/ ./
deb https://yourusername.github.io/repo/staging/ ./
```

stable = safe to recommend broadly. beta = mostly stable, opt-in testers. staging = expect breakage, for you/collaborators only.
