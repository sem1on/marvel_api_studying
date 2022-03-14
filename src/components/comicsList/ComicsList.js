import { useState, useEffect} from 'react'
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const setContent = (process, Component, newComicsLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newComicsLoading ? <Component/> : <Spinner/>;
            break;
        case 'confirmed':
            return <Component/>;
            break;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [ofset, setOfset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {getAllComics, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(ofset, true);
    }, [])

    const onRequest = (ofset, initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(ofset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if(newComicsList.lenght < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewComicsLoading(newComicsLoading => false);
        setOfset(ofset => ofset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.titile}
                        className="comics__item-img"/>
                        <div className="comics__item-name">{item.titile}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), newComicsLoading)}
            <button 
                className="button button__main button__long"
                disabled={newComicsLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(ofset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;