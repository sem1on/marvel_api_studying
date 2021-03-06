import { useHttp} from '../components/hooks/http.hook';

const useMarvelService = () => {
    const {loading, error, request, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=16bd46a73fa16c184896dc929ae4a3b8';
    const _baseOfset = 210;

    const getAllCharacters = async (ofset = _baseOfset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${ofset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (ofset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${ofset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            price: comics.prices.price ? `${comics.prices.price} $` : 'NOT AVAILABLE',
            language: comics.textObjects.language || 'en-us',
        }
    }

    return {loading, 
            error, 
            clearError, 
            process,
            setProcess,
            getAllCharacters, 
            getCharacter, 
            getAllComics, 
            getComics }
}

export default useMarvelService;