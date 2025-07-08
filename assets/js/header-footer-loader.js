$(document).ready(function () {
    const currentPath = window.location.pathname;
    const depth = currentPath.split('/').length - 2;
    const basePath = '../'.repeat(depth);

    $("#header").load(basePath + "includes/header.html", function () {
        const currentPage = currentPath.split('/').pop() || 'index.html';
        $('.nav-item a, .dropdown-item a').each(function () {
            const href = $(this).attr('href');
            if (href && href.endsWith(currentPage)) {
                $(this).addClass('active');
                $(this).closest('.dropdown-menu').siblings('a.nav-link').addClass('active');
            }
        });
    });

    $("#footer").load(basePath + "includes/footer.html");
});
