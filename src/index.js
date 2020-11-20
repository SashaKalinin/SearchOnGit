import {fromEvent, EMPTY} from 'rxjs';
import {map, debounceTime, filter, distinctUntilChanged, switchMap, mergeMap, tap, catchError} from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';

const url = 'https://api.github.com/search/users?q=';

const search = document.querySelector('#search');
const res = document.querySelector('#results');

const stream$ = fromEvent(search, 'input')
    .pipe(
        map(e => e.target.value),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => res.innerHTML = ''),
        filter(v => v.trim()),
        switchMap(v => ajax.getJSON(url + v).pipe(
            catchError(err => EMPTY)
        )),
        map(response => response.items),
        mergeMap(i => i)
    );

stream$.subscribe( user => {
    const html = `
        <div class="card" style="display: flex;flex-direction: column; justify-content: center; align-items: center">
            <div class="card-img">
                <img style="width: 100%;height: 100%" src="${user.avatar_url}" />
            </div>
            <span class="card-title" style="">${user.login}</span>
            <div class="card-action">
            <a href="${user.html_url}" style="margin: 0" target="_blank">Open GitHub</a>
            </div>
         </div>
    `;
    res.insertAdjacentHTML('beforeend',html);
})