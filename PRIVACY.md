# YtZen — Privacy Policy

**Last updated:** February 17, 2026

## Overview

YtZen is a browser extension that hides distracting elements on YouTube (recommendations, comments, and homepage feed) to help users focus on their research and viewing.

## Data Collection

YtZen does **not** collect, store, transmit, or share any personal data or user information of any kind.

## What YtZen Stores

The extension stores a single preference value (`ytzenEnabled: true/false`) using Chrome's built-in `chrome.storage.sync` API. This value indicates whether Research Mode is turned on or off. No other data is stored.

## Permissions

- **storage**: Used solely to persist the on/off toggle state across sessions.
- **activeTab**: Used solely to communicate the toggle state to the active YouTube tab.
- **Host permission (youtube.com)**: Used solely to inject CSS that hides distracting page elements on YouTube.

## Third Parties

YtZen does not send data to any third-party service, analytics platform, or external server. The extension operates entirely locally within your browser.

## Remote Code

YtZen does not load or execute any remote code. All JavaScript and CSS is bundled within the extension package.

## Changes

If this privacy policy is updated, the changes will be reflected in this document with an updated date.

## Contact

If you have questions about this privacy policy, please open an issue at [github.com/sepehr-mohseni/ytzen](https://github.com/sepehr-mohseni/ytzen).
