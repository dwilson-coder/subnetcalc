# SubnetCalc

![SubnetCalc](https://raw.githubusercontent.com/dwilson-coder/subnetcalc/refs/heads/main/og.jpg)

SubnetCalc is a browser-based IPv4 subnet calculator for quickly finding subnet details and understanding how the calculations work. It combines practical network information with step-by-step binary and bitwise explanations.

## Features

- Calculate IPv4 subnet details from an IP address and CIDR prefix.
- Display the subnet mask, wildcard mask, network address, and broadcast address.
- Calculate total addresses and usable host ranges.
- Handle `/31` and `/32` special cases.
- Generate IPv4-mapped IPv6 and 6to4-related addresses.
- Show the calculation process using binary values and bitwise operations.
- Explore an animated data-flow diagram of the calculation functions.
- Browse networking explanations covering CIDR, subnet masks, host counts, and network versus broadcast addresses.
- Responsive dark interface that works on desktop and mobile browsers.

## Pages

- `index.html` - Interactive IPv4 subnet calculator.
- `dataflow.html` - Animated visualization of the calculation flow.
- `faq.html` - Frequently asked questions and networking reference material.
- `about.html` - Project overview, intended audience, and technical notes.

## Usage

This is a static HTML, CSS, and JavaScript project. Open `index.html` directly in a browser, or serve the project directory with any local static web server.

For example, with Python installed:

```bash
python -m http.server
```

Then open `http://localhost:8000` in your browser.

To calculate a subnet:

1. Enter an IPv4 address, such as `192.168.10.50`.
2. Select a CIDR prefix, such as `/25`.
3. Select **Calculate**.

## Project Structure

```text
.
├── index.html
├── about.html
├── dataflow.html
├── faq.html
├── css/
│   └── style.css
├── src/
│   └── app.js
└── og.jpg
```

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Inline SVG for the data-flow visualization

No build tools, frameworks, or external dependencies are required.

## Author

Damion Wilson for CoeBox LLC

- Website: <https://codeboxllc.net/>
- LinkedIn: <https://www.linkedin.com/in/damion-coder-wilson>
- Bluesky: <https://bsky.app/profile/dwilsoncoder.bsky.social>
- GitHub: <https://github.com/dwilson-coder/subnetcalc>
