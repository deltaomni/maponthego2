export function isMainDomain() {
    const host = location.hostname;

    return (
        host === 'maponthego.com' ||
        host === 'www.maponthego.com' ||
        host === 'localhost'
    );
}

