import { useState } from "react";
import type { Torrent } from "./type";

export function useGetMetadata() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [torrent, setTorrent] = useState<Torrent | null>(null);

    const onSubmit = (e: any) => {
        e.preventDefault();

        if (!url) return;

        setLoading(true);

        fetch("/api/metadata", {
            method: "post",
            body: JSON.stringify({ url })
        })
            .then(raw => raw.json())
            .then((data) => setTorrent(data))
            .finally(() => setLoading(false))
    };

    return { url, setUrl, loading, torrent, onSubmit }
}