# **NgModules**

https://angular.io/guide/ngmodules

**NgModules** configure the injector and the compiler and help organize related things together.

An NgModule is a class marked by the `@NgModule` decorator. `@NgModule` takes a metadata object that describes how to compile a component's template and how to create an injector at runtime. It identifies the module's own components, directives, and pipes, making some of them public, through the `exports` property, so that external components can use them. `@NgModule` can also add service providers to the application dependency injectors.

NgModule metadata does the following:

- Declares which components, directives, and pipes belong to the module.
- Makes some of those components, directives, and pipes public so that other module's component templates can use them.
- Imports other modules with the components, directives, and pipes that components in the current module need.
- Provides services that other application components can use.

# Imports, declarations, providers

https://stackoverflow.com/questions/39062930/what-is-the-difference-between-declarations-providers-and-import-in-ngmodule

- `imports` makes the exported declarations of other modules available in the current module

- `declarations` are to make directives (including components and pipes) from the current module available to other directives in the current module. Selectors of directives, components or pipes are only matched against the HTML if they are declared or imported.

- `providers` are to make services and values known to DI (dependency injection). They are added to the root scope and they are injected to other services or directives that have them as dependency.

  

  A special case for `providers` are lazy loaded modules that get their own child injector. `providers` of a lazy loaded module are only provided to this lazy loaded module by default (not the whole application as it is with other modules).

# Provide the Service

You must make the `HeroService` available to the dependency injection system before Angular can *inject* it into the `HeroesComponent` by registering a *provider*. A provider is something that can create or deliver a service; in this case, it instantiates the `HeroService` class to provide the service.

To make sure that the `HeroService` can provide this service, register it with the *injector*, which is the object that is responsible for choosing and injecting the provider where the app requires it.

By default, the Angular CLI command `ng generate service` registers a provider with the *root injector* for your service by including provider metadata, that is `providedIn: 'root'` in the `@Injectable()` decorator.

```typescript

      @Injectable({  providedIn: 'root', })    
```

When you provide the service at the root level, Angular creates a single, shared instance of `HeroService` and injects into any class that asks for it. Registering the provider in the `@Injectable` metadata also allows Angular to optimize an app by removing the service if it turns out not to be used after all.

# HttpClient 

https://angular.io/guide/http

All `HttpClient` methods return an RxJS `Observable` of something.

HTTP is a request/response protocol. You make a request, it returns a single response.

In general, an observable *can* return multiple values over time. An observable from `HttpClient` always emits a single value and then completes, never to emit again.

This particular `HttpClient.get()` call returns an `Observable<Hero[]>`; that is, "*an observable of hero arrays*". In practice, it will only return a single hero array.

### `HttpClient.get()` returns response data

`HttpClient.get()` returns the body of the response as an untyped JSON object by default. Applying the optional type specifier, `<Hero[]>` , adds TypeScript capabilities, which reduce errors during compile time.

The server's data API determines the shape of the JSON data. The *Tour of Heroes* data API returns the hero data as an array.

## HttpInterceptor

### Getting error details

An app  should give the user useful feedback when data access fails. A raw error object is not particularly useful as feedback. In addition to detecting that an error has occurred, you need to get  error details and use those details to compose a user-friendly response.

Two types of errors can occur.

- The server backend might reject the request, returning an HTTP response with a status code such as 404 or 500. These are error *responses*.
- Something could go wrong on the client-side such as a network error  that prevents the request from completing successfully or an exception  thrown in an RxJS operator. These errors produce JavaScript `ErrorEvent` objects.

`HttpClient` captures both kinds of errors in its `HttpErrorResponse`. You can inspect that response to identify the error's cause.

```typescript
    if (jwtToken) {
      return next.handle(this.addToken(req, jwtToken)).pipe(catchError(error => {
          if (error instanceof HttpErrorResponse
              && error.status === 403) {
              return this.handleAuthErrors(req, next);
          } else {
              return throwError(error);
          }
      }));
  }
```

### The *next* object

The `next` object represents the next interceptor in the chain of interceptors. The final `next` in the chain is the `HttpClient` backend handler that sends the request to the server and receives the server's response.

Most interceptors call `next.handle()` so that the request flows through to the next interceptor and, eventually, the backend handler. An interceptor *could* skip calling `next.handle()`, short-circuit the chain, and [return its own `Observable`](https://angular.io/guide/http#caching) with an artificial server response.

This is a common middleware pattern found in frameworks such as Express.js.

### Handling interceptor events

Most `HttpClient` methods return observables of `HttpResponse<any>`. The `HttpResponse` class itself is actually an event, whose type is `HttpEventType.Response`. A single HTTP request can, however, generate multiple events of other types, including upload and download progress events. The methods `HttpInterceptor.intercept()` and `HttpHandler.handle()` return observables of `HttpEvent<any>`.

Many interceptors are only concerned with the outgoing request and return the event stream from `next.handle()` without modifying it. Some interceptors, however, need to examine and modify the response from `next.handle()`; these operations can see all of these events in the stream.s

Although interceptors are capable of modifying requests and responses, the `HttpRequest` and `HttpResponse` instance properties are `readonly`, rendering them largely immutable. They are immutable for a good reason: an app might retry a request  several times before it succeeds, which means that the interceptor chain can re-process the same request multiple times. If an interceptor could modify the original request object, the re-tried operation would start from the modified request rather than the  original. Immutability ensures that interceptors see the same request  for each try.

# Observable

Observables are lazy collections of multiple values over time.

1. **Observables are lazy**
   You could think of lazy observables as newsletters. For each subscriber a  new newsletter is created. They are then only send to those people, and  not to anyone else.

2. **Observables can have multiple values over time**
   Now if you keep that subscription to the newsletter open, you will get a  new one every once and a while. The sender decides when you get it but  all you have to do is just wait until it comes straight into your inbox.

3.  **Observables are cancelable.** 

    If you don’t want your newsletter anymore, you unsubscribe. With  **promises** this is different, you can’t cancel a promise. If the promise  is handed to you, the process that will produce that promise’s  resolution is already underway, and you generally don’t have access to  prevent that promise’s resolution from executing.



**Pull**

When pulling, the data consumer  decides when it get’s data from the data producer. The producer is  unaware of when data will be delivered to the consumer.

**Push**

Promises are the most common way of push in JavaScript today. A promise (the  producer) delivers a resolved value to registered callbacks (the  consumers), but unlike functions, it is the promise which is in charge  of determining precisely when that value is “pushed” to the callbacks.

Observables are a new way of pushing data in JavaScript. An observable is a  Producer of multiple values, “pushing” them to subscribers.

## Creating an observable yourself

```javascript
import { Observable } from "rxjs/Observable"

// create observable
const simpleObservable = new Observable((observer) => {
    
    // observable execution
    observer.next("bla bla bla")
    observer.complete()
})

// subscribe to the observable
simpleObservable.subscribe()

// dispose the observable
simpleObservable.unsubscribe()
```

**Subscribing to observables
**Remember,  observables are lazy. If you don’t subscribe nothing is going to happen. It’s good to know that when you subscribe to an observer, each call of `subscribe()` will trigger it’s own independent execution for that given observer.

On the parameter that was given when creating the observable there are  three functions available to send data to the subscribers of the  observable:

- “next”: sends any value such as Numbers, Arrays or objects to it’s subscribers.
- “error”: sends a Javascript error or exception
- “complete”: does not send any value.

Calls of the next are the most common as they actually deliver the data  to it’s subscribers. During observable execution there can be an  infinite calls to the `observer.next()`, however when `observer.error()` or `observer.complete()` is called, the execution stops and no more data will be delivered to the subscribers.

**Disposing observables
**Because observable execution can run for an infinite amount of time, we need a  way to stop it from executing. Since each execution is run for every  subscriber it’s important to not keep subscriptions open for subscribers that don’t need data anymore, as that would mean a waste of memory and  computing power.

When you subscribe to an observable, you get back a subscription, which represents the ongoing execution. Just call `unsubscribe()`to cancel the execution.

# Subjects

A Subject is like an Observable. It can be subscribed to, just like you normally would with Observables. It also has methods like `next()`, `error()` and `complete()` just like the observer you normally pass to your Observable creation function.

The main reason to use Subjects is to multicast. An Observable by default  is unicast. Unicasting means that each subscribed observer owns an  independent execution of the Observable. To demonstrate this:

```javascript
import * as Rx from "rxjs";

const observable = Rx.Observable.create((observer) => {
    observer.next(Math.random());
});

// subscription 1
observable.subscribe((data) => {
  console.log(data); // 0.24957144215097515 (random number)
});

// subscription 2
observable.subscribe((data) => {
   console.log(data); // 0.004617340049055896 (random number)
});
```

Multicasting basically means that one Observable execution is shared among multiple subscribers.

Subjects are like EventEmitters, they maintain a registry of many listeners. When calling subscribe on a Subject it does not invoke a new execution  that delivers data. It simply registers the given Observer in a list of  Observers

Whereas Observables are solely data producers, Subjects can both be used as a  data producer and a data consumer. By using Subjects as a data consumer  you can use them to convert Observables from unicast to multicast.  Here’s a demonstration of that:

```typescript
import * as Rx from "rxjs";

const observable = Rx.Observable.create((observer) => {
    observer.next(Math.random());
});

const subject = new Rx.Subject();

// subscriber 1
subject.subscribe((data) => {
    console.log(data); // 0.24957144215097515 (random number)
});

// subscriber 2
subject.subscribe((data) => {
    console.log(data); // 0.24957144215097515 (random number)
});

observable.subscribe(subject);
```



# The BehaviorSubject

https://medium.com/@luukgruijs/understanding-rxjs-behaviorsubject-replaysubject-and-asyncsubject-8cc061f1cfc0

The BehaviorSubject has the characteristic that it stores the “current”  value. This means that you can always directly get the last emitted  value from the BehaviorSubject.

```typescript
import * as Rx from "rxjs";

const subject = new Rx.BehaviorSubject();

// subscriber 1
subject.subscribe((data) => {
    console.log('Subscriber A:', data);
});

subject.next(Math.random());
subject.next(Math.random());

// subscriber 2
subject.subscribe((data) => {
    console.log('Subscriber B:', data);
});

subject.next(Math.random());

console.log(subject.value)

// output
// Subscriber A: 0.24957144215097515
// Subscriber A: 0.8751123892486292
// Subscriber B: 0.8751123892486292
// Subscriber A: 0.1901322109907977
// Subscriber B: 0.1901322109907977
// 0.1901322109907977
```

There are a few things happening here:

1. We first create a subject and subscribe to that with Subscriber A. The  Subject then emits it’s value and Subscriber A will log the random  number.
2. The subject emits it’s next value. Subscriber A will log this again
3. Subscriber B starts with subscribing to the subject. Since the subject is a  BehaviorSubject the new subscriber will automatically receive the last  stored value and log this.
4. The subject emits a new value again. Now both subscribers will receive the values and log them.
5. Last we log the current Subjects value by simply accessing the `.value` property. This is quite nice as it’s synchronous. You don’t have to call subscribe to get the value.

Last but not least, you can create BehaviorSubjects with a start value.  When creating Observables this can be quite hard. With BehaviorSubjects  this is as easy as passing along an initial value. See the example  below:

```typescript
import * as Rx from "rxjs";

const subject = new Rx.BehaviorSubject(Math.random());

// subscriber 1
subject.subscribe((data) => {
    console.log('Subscriber A:', data);
});

// output
// Subscriber A: 0.24957144215097515
```

# Pipes

“A pipe is a way to write display-value transformations that you can  declare in your HTML. It takes in data as input and transforms it to a  desired output”.

https://itnext.io/understanding-angular-pipes-5d1154f57d4f

# Routing

links:

https://medium.com/angular-in-depth/the-three-pillars-of-angular-routing-angular-router-series-introduction-fb34e4e8758e

The core focus of the router is to enable navigation among routable  components within an Angular application, which requires the router to **render a set of components using an outlet on the page, and then reflect the rendered state in the url.** In order to do this, the router needs some way to associate urls with the  appropriate set of components to load. It accomplishes this by letting a developer define a router state configuration object, which describes  which components to display for a given url.

```javascript
import { RouterModule, Route } from '@angular/router';

const ROUTES: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: 'notes',
    children: [
      { path: '', component: NotesComponent },
      { path: ':id', component: NoteComponent }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES)
  ]
})
```

It will produce the following tree of router states when passed into `routerModule.forRoot()` :

<img src="https://miro.medium.com/max/1386/1*_ySB8CTLi45dBvUj8Sqxgg.png" alt="Image for post" style="zoom: 50%;" />

An important point is that at any time, some router state (i.e.  arrangement of components) is being displayed on screen to the user,  based on the current url. This arrangement is known as the active route. **An active route is just some subtree of the tree of all router states**. For instance, the url `/notes` would be represented as the following active route:

<img src="https://miro.medium.com/max/1366/1*WBnoxr-Hd6LacI4mltwcFg.png" alt="Image for post" style="zoom:50%;" />

1. The RouterModule has a `forChild` method, which also accepts an array of Routes. While both `forChild` and `forRoot` return modules containing all of the router directives and route configurations, `forRoot` also creates an instance of the Router service. [**Since  the Router service mutates the browser location, which is a shared  global resource, there can be only one active Router service**.](https://blog.angularindepth.com/avoiding-common-confusions-with-modules-in-angular-ada070e6891f) This is why you should use `forRoot` only once in your application, in the root app module. Feature modules should use `forChild`.

2. When a route’s path is matched, the components referenced inside of the router state’s `component` properties are rendered using router-[*outlets*](https://angular.io/api/router/RouterOutlet)*,* which are dynamic elements that display an activated component. Technically, the components will be rendered as a *sibling* to the router outlet directive, not inside of it. Router outlets can  also be nested within one another, forming parent/child route  relationships.

At any given point in time, **the URL represents a serialized version of the application’s currently activated router state**. Changes in the router state will change the URL, and changes in the URL will change the router state. They are both representations of the same thing.

<img src="https://miro.medium.com/max/1380/1*PTDVdMLfL8nihVgm2X0NgQ.png" alt="Image for post" style="zoom:50%;" />

During this **navigation cycle, the router emits a series of events**. The Router service provides an observable for listening to router  events, which can be used to define logic, such as running a loading  animation, as well as aiding in debugging routing. Some noteworthy  events during this cycle are:

`NavigationStart:` Represents the start of a navigation cycle.

 `NavigationCancel:` For instance, a guard refuses to navigate to a route. 

`RoutesRecognized:` When a url has been matched to a route. 

NavigationEnd: Triggered when navigation ends successfully.

## Route Guards

Use angular-jwt in your `AuthService`

```typescript
// src/app/auth/auth.service.tsimport { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';@Injectable()
export class AuthService {  constructor(public jwtHelper: JwtHelperService) {}  // ...
  public isAuthenticated(): boolean {    const token = localStorage.getItem('token');    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }}
```

> ***Note:\*** *This example assumes that you are storing the user’s JWT in local storage.*

Create a new service which implements the route guard. You can call it whatever you like, but something like `auth-guard.service` is generally sufficient.

```typescript
// src/app/auth/auth-guard.service.tsimport { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';@Injectable()
export class AuthGuardService implements CanActivate {  constructor(public auth: AuthService, public router: Router) {}  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }}
```

The service injects `AuthService` and `Router` and has a single method called `canActivate`. This method is necessary to properly implement the `CanActivate` interface.

The `canActivate` method returns a `boolean` indicating whether or not navigation to a route should be allowed. If  the user isn’t authenticated, they are re-routed to some other place, in this case a route called `/login`.

Now the guard can be applied to any routes you wish to protect.

```typescript
// src/app/app.routes.tsimport { Routes, CanActivate } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { 
  AuthGuardService as AuthGuard 
} from './auth/auth-guard.service';export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '' }
];
```

The `/profile` route has an extra config value now: `canActivate`. The `AuthGuard` that was created above is passed to an array for `canActivate` which means it will be run any time someone tries to access the `/profile` route. If the user is authenticated, they get to the route. If not, they are redirected to the `/login` route.

Angular’s route guards are interfaces which can tell the router whether or not it should allow navigation to a requested route. They make this decision by looking for a `true` or `false` return value from a class which implements the given guard interface.

### Checking for a User’s Role

Create a new guard service called `RoleGuardService`.

```typescript
// src/app/auth/role-guard.service.tsimport { Injectable } from '@angular/core';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';@Injectable()
export class RoleGuardService implements CanActivate {  constructor(public auth: AuthService, public router: Router) {}  canActivate(route: ActivatedRouteSnapshot): boolean {    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;    const token = localStorage.getItem('token');    // decode the token to get its payload
    const tokenPayload = decode(token);    if (
      !this.auth.isAuthenticated() || 
      tokenPayload.role !== expectedRole
    ) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }}
```

In this guard we’re using `ActivatedRouteSnapshot` to give us access to the `data` property for a given route. This `data` property is useful because we can pass an object with some custom  properties to it from our route configuration. We can then pick up that  custom data in the guard to help with making routing decisions.

In this case we’re looking for a role that we expect the user to have if  they are to be allowed access to the route. Next we are decoding the  token to grab its payload. If the user isn’t authenticated **or** if they don’t have the role we expect them to have in their token  payload, we cancel navigation and have them log in. Otherwise, they are  free to proceed.

We can now use this `RoleGuardService` for any of our routes. We might, for example, want to protect an `/admin` route.

```typescript
// src/app/app.routes.tsimport { Routes, CanActivate } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { 
  AuthGuardService as AuthGuard 
} from './auth/auth-guard.service';
import { 
  RoleGuardService as RoleGuard 
} from './auth/role-guard.service';export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [RoleGuard], 
    data: { 
      expectedRole: 'admin'
    } 
  },
  { path: '**', redirectTo: '' }
];
```

For the `/admin` route, we’re still using `canActivate` to control navigation, but this time we’re passing an object on the `data` property which has that `expectedRole` key that we’ve already seen in the `RoleGuardService`.

# RxJS The map operator

https://medium.com/@luukgruijs/understanding-rxjs-map-mergemap-switchmap-and-concatmap-833fc1fb09ff

The map operator is the most common of all. For each value that the Observable emits you can apply a function  in which you can modify the data. The return value will, behind the  scenes, be reemitted as an Observable again so you can keep using it in  your stream. It works pretty much the same as how you would use it with  Arrays. The difference is that Arrays will always be just Arrays and  while mapping you get the value of the current index in the Array. With  Observables the type of data can be of all sorts of types. This means  that you might have to do some additional operations in side your  Observable map function to get the desired result. Let’s look at some  examples:

import { of } from 'rxjs'; 

import { map } from 'rxjs/operators';



```typescript
import { of } from 'rxjs'; 
import { map } from 'rxjs/operators';

// lets create our data first
const data = of([
  {
    brand: 'porsche',
    model: '911'
  },
  {
    brand: 'porsche',
    model: 'macan'
  },
  {
    brand: 'ferarri',
    model: '458'
  },
  {
    brand: 'lamborghini',
    model: 'urus'
  }
]);

// get data as brand+model string. Result: 
// ["porsche 911", "porsche macan", "ferarri 458", "lamborghini urus"]
data
  .pipe(
    map(cars => cars.map(car => `${car.brand} ${car.model}`))
  ).subscribe(cars => console.log(cars))

// filter data so that we only have porsches. Result:
// [
//   {
//     brand: 'porsche',
//     model: '911'
//   },
//   {
//     brand: 'porsche',
//     model: 'macan'
//   }
// ]
data
  .pipe(
    map(cars => cars.filter(car => car.brand === 'porsche'))
  ).subscribe(cars => console.log(cars))
```



# RxJS MergeMap

https://medium.com/@luukgruijs/understanding-rxjs-map-mergemap-switchmap-and-concatmap-833fc1fb09ff

Now let’s say there is a scenario where we have an Observable that emits an array, and for each item in the array we need to fetch data from the  server.

We could do this by subscribing to the array, then setup a map that calls a function which handles the API call and then subscribe to the result.  This could look like the following:

```typescript
import { of, from } from 'rxjs'; 
import { map, delay } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

from([1,2,3,4]).pipe(
  map(param => getData(param))
).subscribe(val => console.log(val);
```

To further clarify this: we have `from([1,2,3,4])` as our ‘outer’ Observable, and the result of the `getData()` as our ‘inner’ Observable. In theory we have to subscribe to both our  outer and inner Observable to get the data out. This could like this:

```typescript
import { of, from } from 'rxjs'; 
import { map, delay } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

from([1,2,3,4]).pipe(
  map(param => getData(param))
).subscribe(val => val.subscribe(data => console.log(data)));
```

MergeAll takes care of subscribing to the ‘inner’ Observable so that we  no longer have to Subscribe two times as mergeAll merges the value of  the ‘inner’ Observable into the ‘outer’ Observable. This could look like this:

```typescript
import { of, from } from 'rxjs'; 
import { map, delay, mergeAll } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

from([1,2,3,4]).pipe(
  map(param => getData(param)),
  mergeAll()
).subscribe(val => console.log(val));
```

This already is much better, but as you might already guessed mergeMap  would be the best solution for this. Here’s the full example:

```typescript
import { of, from } from 'rxjs'; 
import { map, mergeMap, delay, mergeAll } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

// using a regular map
from([1,2,3,4]).pipe(
  map(param => getData(param))
).subscribe(val => val.subscribe(data => console.log(data)));

// using map and mergeAll
from([1,2,3,4]).pipe(
  map(param => getData(param)),
  mergeAll()
).subscribe(val => console.log(val));

// using mergeMap
from([1,2,3,4]).pipe(
  mergeMap(param => getData(param))
).subscribe(val => console.log(val));

```

# RxJS SwitchMap

https://medium.com/@luukgruijs/understanding-rxjs-map-mergemap-switchmap-and-concatmap-833fc1fb09ff

SwitchMap has similar behaviour in that it will also subscribe to the inner  Observable for you. However switchMap is a combination of switchAll and  map. SwitchAll cancels the previous subscription and subscribes to the  new one. For our scenario where we want to do an API call for each item  in the array of the ‘outer’ Observable, switchMap does not work well as  it will cancel the first 3 subscriptions and only deals with the last  one. This means we will get only one result. The full example can be  seen here:

```typescript
import { of, from } from 'rxjs'; 
import { map, delay, switchAll, switchMap } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

// using a regular map
from([1,2,3,4]).pipe(
  map(param => getData(param))
).subscribe(val => val.subscribe(data => console.log(data)));

// using map and switchAll
from([1,2,3,4]).pipe(
  map(param => getData(param)),
  switchAll()
).subscribe(val => console.log(val));

// using switchMap
from([1,2,3,4]).pipe(
  switchMap(param => getData(param))
).subscribe(val => console.log(val));

```

While switchMap wouldn’t work for our current scenario, it will work for other scenario’s. It would for example come in handy if you compose a  list of filters into a data stream and perform an API call when a filter is changed. If the previous filter changes are still being processed  while a new change is already made, it will cancel the previous  subscription and start a new subscription on the latest change. An  example can be seen here:

```typescript
import { of, from, BehaviorSubject } from 'rxjs'; 
import { map, delay, switchAll, switchMap } from 'rxjs/operators';

const filters = ['brand=porsche', 'model=911', 'horsepower=389', 'color=red']
const activeFilters = new BehaviorSubject('');

const getData = (params) => {
  return of(`retrieved new data with params ${params}`).pipe(
    delay(1000)
  )
}

const applyFilters = () => {
  filters.forEach((filter, index) => {

    let newFilters = activeFilters.value;
    if (index === 0) {
      newFilters = `?${filter}`
    } else {
      newFilters = `${newFilters}&${filter}`
    }

    activeFilters.next(newFilters)
  })
}

// using switchMap
activeFilters.pipe(
  switchMap(param => getData(param))
).subscribe(val => console.log(val));

applyFilters()

```



# Angular Reactive Templates with ngIf and the Async Pipe

https://blog.angular-university.io/angular-reactive-templates/

## Reactive Style Templates - The ngIf as syntax and the async pipe

If we combine all the available features of `ngIf` with the `async` pipe, we can now come up with the following solution:

```typescript
@Component({
  selector: 'app-root',
    template: `
    <div class="course-detail" *ngIf="courseObs | async as course; else loading">
        <div class="course-field">
            {{course.shortDescription}}
        </div>
        <div class="course-field">
            {{course.longDescription}}
        </div>
        <div class="course-field">
            {{course.duration}}
        </div>
        <div class="course-field">
            {{course.flags}}
        </div>
    </div>
    <ng-template #loading>
        <div>Loading ...</div>
    </ng-template>    
`})
export class AppComponent implements OnInit {

    courseObs: Observable<Course>;

    constructor(private courseService: CourseService) {
    }

    ngOnInit() {
        this.courseObs = this.courseService.loadCourse(1);
    }

}
      
```

So what is going on in this example? Let's break it down:

- the async pipe is being used to subscribe only once to `courseObs`
- the else clause is defining what to display while the data is not available (the `ng-template` named `loading`)
- the 'as' syntax is specifying a template variable for the expression `courseObs | async`, and that variable is named `course`
- the result of this expression is aliased as `course`, and corresponds to the course object emitted by the course observable
- now there is a local `course` variable available inside the `ngIf`section, that corresponds to the value emitted by the backend call
- This `course` variable is ready to be used, just like if the `course` object had been passed synchronously as an `@Input()` to this component

#### Advantages of this more reactive approach

Here are the advantages of writing our templates in this more reactive style:

- There are no manual subscriptions at the component level for observables coming out of the service layer
- we don't have to create smaller components to be able to use the async pipe only once and prevent multiple subscriptions
- no local data state variables are defined at the level of the  component, so its less likely to run into issues caused by mutating  local component state
- we now have a more declarative code: both the component and the  template are very declarative, we are simply plugging in together  streams of data instead of storing local variables and passing them to  the template

We end up with a very readable template, less code and fewer things  that can go wrong, like memory leaks on long-running streams - because  the async pipe will take care of unsubscriptions transparently!

Also, there was no need to repeat the async pipe multiple times on  the template, or creating an intermediate component just to avoid that.

# Forms

## Reactive Forms

https://www.digitalocean.com/community/tutorials/angular-reactive-forms-introduction

## Dynamic FormArray

https://www.bitovi.com/blog/managing-nested-and-dynamic-forms-in-angular

https://www.tektutorialshub.com/angular/nested-formarray-example-add-form-fields-dynamically/

https://netbasal.com/angular-reactive-forms-the-ultimate-guide-to-formarray-3adbe6b0b61a



# Dynamic components creation

https://angular.io/guide/dynamic-component-loader



# On changes angular form event

https://www.digitalocean.com/community/tutorials/angular-reactive-forms-valuechanges



# @Input and @Output and service communication between components

https://stackoverflow.com/questions/51027711/angular-input-and-output-vs-injectable-service

`@Input` and `@Output` are useful if the  communication between a parent and child is just that, between a parent  and child. It wouldn't make sense to have a service that maintains  singleton data for just 2 components (or however deeply nested  grandparent -> parent -> child components are).

They're also useful if your parent needs to react to a change in the  child. For example, clicking a button in a child component that calls a  function in the parent:

```js
<my-child-component (myOutputEmitter)="reactToChildChange($event)"></my-child-component>
```

And in parent:

```js
reactToChildChange(data: any) {
  // do something with data
}
```

If you find yourself passing many `@Input` properties to a child, and want to tidy up a template, then you can define an interface for the input, and pass it instead. e.g.

```js
export interface MyChildProperties {
   property?: any;
   anotherProperty?: any;
   andAnotherProperty?: any;
}
```

Then you can pass a definition to your child, which is set from the parent:

```js
childProperties: MyChildProperties = {
    property: 'foo',
    anotherProperty: 'bar',
    andAnotherProperty: 'zoob'
}
```

Then your child component may have:

```js
@Input properties: MyChildProperties;
```

and your template becomes:

```js
<my-child-component [properties]="childProperties"></my-child-component>
```

Your child can access those properties from `properties.property`, `properties.anotherProperty`, etc.

Clean, tidy, and your data is now contained to those components that need to communicate.

Services, however, should be used where *more than one component* needs access to read/write data across your entire application. Consider a `UserService` for example, where many different components need to be able to access  the currently logged in user. In this case, a service is sensible, as  its a singleton, so once you have set your logged in user, any  components that inject the `UserService` can access its data and functions.

Similarly, if you were to use a service for reacting to change, then  you'd find yourself writing services with observables so that your  components could subscribe to changes in the data. Eventemitters already give you this pattern with `@Output` as shown above.

If it were a simple parent -> child communication, this is unnecessary overhead, and should be avoided.

That said, if you find yourself using services to manage global  state, you'd be better off using some form of state management such as [ngrx](https://github.com/ngrx)



# @ViewChild

https://stackoverflow.com/questions/56359504/how-should-i-use-the-new-static-option-for-viewchild-in-angular-8

Property decorator that configures a view query. The change detector looks for the first element or the directive matching the selector in the view DOM. If the view DOM changes, and a new child matches the selector, the property is updated.

## static property

In most cases you will want to use `{static: false}`. Setting it like this will ensure query matches that are dependent on binding resolution (like structural directives `*ngIf, etc...`) will be found.

The `{ static: true }` option was introduced to support creating embedded views on the fly. When you are creating a view dynamically and want to acces the `TemplateRef`, you won't be able to do so in `ngAfterViewInit` as it will cause a `ExpressionHasChangedAfterChecked` error. Setting the static flag to true will create your view in ngOnInit.



# Render2

https://www.digitalocean.com/community/tutorials/angular-using-renderer2