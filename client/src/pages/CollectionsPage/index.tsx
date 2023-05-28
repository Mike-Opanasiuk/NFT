import React from 'react';
import CollectionCard from '../../components/CollectionCard';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BASE_API_URL, ICollection } from '../../react-app-env.d';

import './CollectionsPage.scss';

let defaultPerPage = 9;

type Func<T, R> = (arg: T) => R;

type Status = 'Loading...' | 'Not Found' | 'Success';
type Sort = 'asc' | 'desc' | '';
type Sorting = 'name' | 'date';


const CollectionsPage = () => {
    const [count, setCount] = useState<number>(0);
    const [pagesCount, setPagesCount] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<Status>('Loading...');
    const [sort, setSort] = useState<Sort>('asc');
    const [sorting, setSorting] = useState<Sorting>('name');
    const [data, setData] = useState<ICollection[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    let url: string = `${BASE_API_URL}/Collections?`;
    let pages: string = `Page=${page}&PerPage=${defaultPerPage}`;

    const sortAscByName = () => {
        setSorting('name');
        setSort('asc');
    };

    const sortAscByDate = () => {
        setSorting('date');
        setSort('asc');
    };

    const sortDescByDate = () => {
        setSorting('date');
        setSort('desc');
    };

    const sortDescByName = () => {
        setSorting('name');
        setSort('desc');
    };

    const debouncedChangeHandler = useCallback(
        debounce(() => {
            window.scrollTo(0, 0)
        }, 300), []);

    const debouncedSearch = useCallback(
        debounce(() => {
            setSearch();
        }, 500), []);

    useEffect(() => {
        if (category !== '') {
            setStatus('Loading...');
            let requestUrl = url + `&SearchString=${category}` + `&page=${page}`;
            console.log(requestUrl);
            axios.get(requestUrl).then((res) => {
                if (!res.data.collections.length) {
                    setData([]);
                    setPagesCount(1);
                    setStatus('Not Found');
                } else {
                    setData(res.data.collections);
                    setPagesCount(res.data['totalPages']);
                    setStatus('Success');
                }
            }).catch((e) => {
                console.log(e);
            });
        } else if (sort !== '') {
            setStatus('Loading...');
            axios.get(url + pages + `&OrderBy=${sorting}&Order=${sort}`).then((res) => {
                if (!res.data.collections.length) {
                    setData([]);
                    setPagesCount(1);
                    setStatus('Not Found');
                } else {
                    setData(res.data.collections);
                    setPagesCount(res.data['totalPages']);
                    setStatus('Success');
                }
            }).catch((e) => {
                console.error(e);
            });
        } else {
            axios.get(url + pages).then((res) => {
                console.log(url + pages);
                setData(res.data.collections);
                setPagesCount(res.data['totalPages']);
                setStatus('Success');
            }).catch((e) => {
                console.error(e);
            });
        }
    }, [page, category, sort, count]);


    const compose = <T, R, S>(
        f: Func<R, S>,
        g: Func<T, R>
    ): Func<T, S> => {
        return (x: T) => f(g(x));
    };

    const statused = () => {
        switch (status) {
            case 'Loading...':
                return (
                    <div className='d-flex justify-content-center'>
                        <div className='spinner-border' role='status'>
                            <span className='visually-hidden'>Loading...</span>
                        </div>
                    </div>
                );
            case 'Not Found':
                return (
                    <div className='d-flex justify-content-center'>
                        <div className='spinner-border' role='status'>
                            <span className='visually-hidden'>Not Found</span>
                        </div>
                    </div>
                );
            case 'Success':
                return data;
        }
    };

    const filtered = () => {
        return data.filter((elem) => elem.name.toLowerCase().includes(category.toLowerCase()));
    };

    const statAndData = compose(filtered, statused);

    const state = (arg: ICollection[]) => statAndData(arg);

    const setSearch = () => {
        if (inputRef.current && page) {
            setCategory(inputRef.current.value);
            setPage(1);
        } else if (inputRef.current) {
            setCategory(inputRef.current.value);
        }
    };

    return (
        <div className='row mt-5'>
            <div className='d-flex align-self-start col-10'>
                <input
                    ref={inputRef}
                    className='form-control border border-dark'
                    type='text'
                    onChange={() => debouncedSearch()}
                    placeholder='Search'
                />
            </div>
            <div className='col-2 h-100'>
                <li className='nav-item dropdown list-unstyled'>
                    <a
                        className='nav-link dropdown-toggle mt-2 pt-1'
                        data-bs-toggle='dropdown'
                        href='Home#'
                        role='button'
                        aria-haspopup='true'
                        aria-expanded='false'
                    >
                        Sort
                    </a>
                    <div className='dropdown-menu'>
                        <span className='dropdown-item' onClick={() => sortDescByDate()}>
                            Newest first
                        </span>
                        <span className='dropdown-item' onClick={() => sortAscByDate()}>
                            Oldest first
                        </span>
                        <span className='dropdown-item' onClick={() => sortAscByName()}>
                            Sort ascending by name
                        </span>
                        <span className='dropdown-item' onClick={() => sortDescByName()}>
                            Sort descending by name
                        </span>
                    </div>
                </li>
            </div>
            <div className='row row-cols-1 row-cols-md-3 g-4'>
                {
                    !state(data).length ? <h1>{status}</h1> : state(data).map(elem => (
                        <CollectionCard
                            image={elem.image}
                            update={() => setCount(prevState => ++prevState)}
                            name={elem.name}
                            id={elem.id}
                            author={elem.author.userName}
                            title={elem.name}
                            key={elem.id}
                            onClick={() => debouncedChangeHandler()} />))
                }
            </div>
            <div className='row mt-5'>
                <ul className='pagination d-flex justify-content-center'>
                    {
                        Array.from({ length: pagesCount }, (_, index) => index + 1).map((elem, index) => {
                            return (
                                <button
                                    key={elem.toString()}
                                    onClick={() => {
                                        setPage(elem);
                                    }}
                                    className={page === elem ? 'pagination-btn active mr-3' : !!category.length ? 'pagination-btn' : 'pagination-btn mr-3'}>
                                    <span>
                                        {elem}
                                    </span>
                                </button>
                            );
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default CollectionsPage;
