function copyCode() {
    const code = document.querySelector('code').innerText;
    navigator.clipboard.writeText(code);
    alert('Command copied to clipboard!');
}