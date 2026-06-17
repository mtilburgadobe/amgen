// Amgen header — content-first. All nav copy/links/images live in
// content/nav.plain.html; this module fetches that fragment, reads its DOM,
// and builds the brand bar, hover megamenus (desktop), accordion (mobile),
// and the search toggle. No nav text/URLs are hardcoded here.

import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function getNavPath() {
  const meta = getMetadata('nav');
  return meta ? new URL(meta, window.location).pathname : '/nav';
}

async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${getNavPath()}.plain.html`);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

function closeAllPanels(nav) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((el) => {
    el.setAttribute('aria-expanded', 'false');
  });
}

function decorateBrand(section) {
  section.classList.add('nav-brand');
  return section;
}

function decorateMainNav(section, nav) {
  section.classList.add('nav-sections');
  const topList = section.querySelector(':scope > ul');
  if (!topList) return section;
  topList.querySelectorAll(':scope > li').forEach((li) => {
    const submenu = li.querySelector(':scope > ul');
    if (submenu) {
      li.classList.add('nav-drop');
      li.setAttribute('aria-expanded', 'false');
      // Desktop: open on hover, close on leave.
      li.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          closeAllPanels(nav);
          li.setAttribute('aria-expanded', 'true');
        }
      });
      li.addEventListener('mouseleave', () => {
        if (isDesktop.matches) li.setAttribute('aria-expanded', 'false');
      });
      // Mobile: tapping the top label toggles the accordion panel.
      const label = li.querySelector(':scope > a');
      if (label) {
        label.addEventListener('click', (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            const open = li.getAttribute('aria-expanded') === 'true';
            closeAllPanels(nav);
            li.setAttribute('aria-expanded', open ? 'false' : 'true');
          }
        });
      }
    }
  });
  return section;
}

function decorateRightLinks(section) {
  section.classList.add('nav-secondary');
  return section;
}

function decorateTools(section) {
  section.classList.add('nav-tools');
  // The last utility link is the search trigger — turn it into a toggle
  // that reveals an inline search form (built here, per the contract).
  const links = section.querySelectorAll('a');
  const searchLink = links[links.length - 1];
  const searchLabel = searchLink
    ? searchLink.textContent + (searchLink.querySelector('img')?.alt || '')
    : '';
  if (searchLink && /search/i.test(searchLabel)) {
    const form = document.createElement('form');
    form.className = 'nav-search-form';
    form.action = '/search-results';
    form.hidden = true;
    const input = document.createElement('input');
    input.type = 'search';
    input.name = 'q';
    input.placeholder = 'Search';
    input.setAttribute('aria-label', 'Search');
    form.append(input);
    section.append(form);
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      form.hidden = !form.hidden;
      if (!form.hidden) input.focus();
    });
  }
  return section;
}

function handleViewportChange(nav) {
  // Reset transient state when crossing the breakpoint.
  closeAllPanels(nav);
  const hamburger = nav.querySelector('.nav-hamburger');
  if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  nav.classList.remove('nav-open');
}

export default async function decorate(block) {
  const tree = await fetchNav();
  if (!tree) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const sections = [...tree.children].filter((c) => c.tagName === 'DIV');
  // Order in nav.plain.html: brand, main nav, right links, tools.
  const [brand, mainNav, rightLinks, tools] = sections;
  if (brand) nav.append(decorateBrand(brand));

  // Hamburger toggle (mobile).
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.type = 'button';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.append(hamburger);

  if (mainNav) nav.append(decorateMainNav(mainNav, nav));
  if (rightLinks) nav.append(decorateRightLinks(rightLinks));
  if (tools) nav.append(decorateTools(tools));

  isDesktop.addEventListener('change', () => handleViewportChange(nav));

  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);
}
