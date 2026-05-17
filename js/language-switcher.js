function changeLanguage(lang) {

    const currentPage =
        window.location.pathname.split("/").pop();

    window.location.href =
        `../${lang}/${currentPage}`;
}