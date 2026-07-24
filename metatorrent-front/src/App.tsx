import EmptyState from './components/empty.state';
import Footer from './components/footer';
import LoadingState from './components/loading.state';
import SearchForm from './components/search.form';
import TorrentDetails from './components/torrent.detail';
import { useGetMetadata } from './hooks';

function App() {
  const { url, setUrl, loading, torrent, onSubmit } = useGetMetadata();

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-200 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Input Logic */}
        <SearchForm
          url={url}
          setUrl={setUrl}
          onSubmit={onSubmit}
          loading={loading}
        />

        {/* Content Logic */}
        <main>
          {loading ? (
            <LoadingState />
          ) : torrent ? (
            <TorrentDetails torrent={torrent} />
          ) : (
            <EmptyState />
          )}
        </main>


        <Footer />
      </div>
    </div>
  );
}

export default App;
