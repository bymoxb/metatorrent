import { useEffect, useState } from "preact/hooks";
import type { Torrent } from "./type";
import { getMagnetFromHash } from "./utils";

export function useGetMetadata() {
    const [url, setUrl] = useState(() => {
        const magnet = getMagnetFromHash();
        if (magnet) {
            window.history.replaceState(null, "", window.location.pathname);
            return magnet;
        }
        return "";
    });
    const [loading, setLoading] = useState(false);
    const [torrent, setTorrent] = useState<Torrent | null>(null);

    const onSubmit = (e: any) => {
        e.preventDefault();

        if (!url) return;

        setLoading(true);

        fetch("/api/meta", {
            method: "post",
            body: JSON.stringify({ url })
        })
            .then(raw => raw.json())
            .then((data) => setTorrent(data.data))
            .finally(() => setLoading(false))
    };

    return { url, setUrl, loading, torrent, onSubmit }
}

export function useRegisterProtocolHandler() {
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const isRegistered = localStorage.getItem('metatorrent_protocol_registered');
        if (typeof navigator.registerProtocolHandler === 'function' && !isRegistered) {
            setShowRegister(true);
        }
    }, []);

    const handleRegisterProtocol = () => {
        try {
            navigator.registerProtocolHandler(
                "magnet",
                `${window.location.origin}/#url=%s`
            );

            localStorage.setItem('metatorrent_protocol_registered', 'true');
            setShowRegister(false);
        } catch (error) {
            console.error("Failed to register protocol handler:", error);
        }
    };

    return { showRegister, handleRegisterProtocol }
}
