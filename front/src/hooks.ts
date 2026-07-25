import { useEffect, useState } from "preact/hooks";
import type { Torrent } from "./type";
import { getMagnetFromHash } from "./utils";

const ERROR_MESSAGE = "Unable to fetch torrent metadata. Please verify the URL and try again.";

export function useGetMetadata() {
    const [error, setError] = useState<string | null>(null)
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
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.json();
            })
            .then((data) => {
                setTorrent(data.data);
                setError(null);
            })
            .catch(() => setError(ERROR_MESSAGE))
            .finally(() => setLoading(false))
    };

    return { url, setUrl, loading, torrent, onSubmit, error }
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
