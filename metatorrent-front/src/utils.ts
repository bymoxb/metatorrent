export function getFileEmoji(filePath = ''): string {

    const emojiMap = {
        // Video
        mkv: '🎬',
        mp4: '🎬',
        avi: '🎬',
        mov: '🎬',
        webm: '🎬',
        flv: '🎬',
        wmv: '🎬',

        // Audio
        mp3: '🎵',
        wav: '🎵',
        flac: '🎵',
        aac: '🎵',
        ogg: '🎵',
        m4a: '🎵',

        // Imágenes
        jpg: '🖼️',
        jpeg: '🖼️',
        png: '🖼️',
        gif: '🖼️',
        webp: '🖼️',
        svg: '🖼️',
        bmp: '🖼️',
        ico: '🖼️',
        tiff: '🖼️',
        avif: '🖼️',

        // Documentos
        pdf: '📕',
        doc: '📝',
        docx: '📝',
        odt: '📝',
        txt: '📄',
        md: '📄',
        rtf: '📄',

        // Hojas de cálculo
        xls: '📊',
        xlsx: '📊',
        csv: '📊',
        ods: '📊',

        // Presentaciones
        ppt: '📽️',
        pptx: '📽️',
        odp: '📽️',

        // Comprimidos
        zip: '📦',
        rar: '📦',
        '7z': '📦',
        tar: '📦',
        gz: '📦',
        bz2: '📦',
        dwarfs: '📦',

        // Imágenes de disco / ISO
        iso: '💿',
        img: '💿',
        dmg: '💿',
        nrg: '💿',
        vhd: '💽',
        vmdk: '💽',

        // Código / desarrollo
        js: '📜',
        ts: '📜',
        jsx: '⚛️',
        tsx: '⚛️',
        html: '🌐',
        css: '🎨',
        json: '🧩',
        xml: '🧩',
        yaml: '⚙️',
        yml: '⚙️',
        py: '🐍',
        java: '☕',
        cpp: '💻',
        c: '💻',
        php: '🐘',
        sql: '🗄️',

        // Ejecutables / instaladores
        exe: '⚙️',
        msi: '⚙️',
        sh: '⚙️',
        apk: '📱',
        app: '📱',
        deb: '📦',
        rpm: '📦',

        // Fuentes
        ttf: '🔤',
        otf: '🔤',
        woff: '🔤',
        woff2: '🔤',

        // Archivos de configuración
        env: '🔐',
        ini: '⚙️',
        conf: '⚙️',
        config: '⚙️',

        // Fallback
        fallback: '📄'
    } as const;

    type Extension = keyof typeof emojiMap;
    const extension = filePath.split('.').pop()?.toLowerCase() as Extension;

    // Casos especiales sin extensión
    if (filePath.endsWith('.url')) return '🔗';
    if (filePath.endsWith('.lnk')) return '🔗';

    return emojiMap[extension] || emojiMap.fallback;
}

export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
