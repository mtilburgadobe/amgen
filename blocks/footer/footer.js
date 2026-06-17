// Amgen footer — content-first. All copy/links/images live in
// content/footer.plain.html; this module fetches that fragment, reads its DOM,
// and assigns structural classes. No footer text/URLs are hardcoded here.

import { getMetadata } from '../../scripts/aem.js';

function getFooterPath() {
  const meta = getMetadata('footer');
  return meta ? new URL(meta, window.location).pathname : '/footer';
}

async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${getFooterPath()}.plain.html`);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

export default async function decorate(block) {
  const tree = await fetchFooter();
  if (!tree) return;

  const sections = [...tree.children].filter((c) => c.tagName === 'DIV');
  // Order in footer.plain.html: brand logo, social, legal links, copyright.
  const [brand, social, legal, copyright] = sections;
  if (brand) brand.classList.add('footer-brand');
  if (social) social.classList.add('footer-social');
  if (legal) legal.classList.add('footer-legal');
  if (copyright) copyright.classList.add('footer-copyright');

  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  sections.forEach((s) => footer.append(s));

  block.textContent = '';
  block.append(footer);
}
