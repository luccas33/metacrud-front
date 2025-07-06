
import { createPageTemplate } from './page-template';
import { createHomePage } from './pages/home';
import { createMetaCrudPage } from './pages/meta-crud';
import { createNotFoundPage } from './pages/not-found';
import { menuComp } from './shared-comps/menu';

const pageTemplate = createPageTemplate();
const homePage = createHomePage();
const notFoundPage = createNotFoundPage();

let pages = [
    homePage,
    createMetaCrudPage()
];

export function addPage(page) {
    pages = pages.filter(pg => page.name != pg.name);
    pages.push(page);
}

export function getPageFromPath() {
    let pageName = new URL(document.location.href).searchParams.get('page') || 'home';
    navToPage(pageName);
}

export function navToPage(pageName = 'home', props = {}) {
    console.log('navToPage(): ', pageName)
    let page = pages.find(pg => (pg.name || '').toUpperCase() == pageName.toUpperCase());
    if (!page) {
        let message = `Page ${pageName} not found`;
        console.log(message);
        page = notFoundPage;
        props.message = message;
    }

    let lastPage = pages.find(pg => pg.active);
    if (lastPage) {
        lastPage.active = false;
        if (lastPage.pageOut) {
            lastPage.pageOut(props);
        }
    }

    pageTemplate.renderPage({ page, pageProps: props });
    page.active = true;

    if (page.pageIn) {
        page.pageIn(props);
    }

    menuComp.setSelectedMenuItem(pageName);

    let url = new URL(document.location.href);
    url.searchParams.set('page', pageName);
    window.history.pushState(null, '', url.toString());
}

function main() {
    pageTemplate.render();
    document.body.appendChild(pageTemplate.main);
}

main();
