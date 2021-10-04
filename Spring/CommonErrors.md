# could not write json infinite recursion (stackoverflowerror) nested exception 

This the problem with class fields oneToMany mapping

solution:

https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion



# Hibernate

## "*detached entity passed to persist"

**Remove cascading from the child entity `Transaction`**, it should be just:

```java
@Entity class Transaction {
    @ManyToOne // no cascading here!
    private Account account;
}
```

(`FetchType.EAGER` can be removed as well as it's the default for `@ManyToOne`)

**That's all!**

Why? By saying "cascade ALL" on the child entity `Transaction` you require that every DB operation gets propagated to the parent entity `Account`. If you then do `persist(transaction)`, `persist(account)` will be invoked as well.

But only transient (new) entities may be passed to `persist` (`Transaction` in this case). The detached (or other non-transient state) ones may not (`Account` in this case, as it's already in DB).

Therefore you get the exception *"detached entity passed to persist"*. The `Account` entity is meant! Not the `Transaction` you call `persist` on.

------

You generally don't want to propagate from child to parent. Unfortunately there are many code examples in books (even in good ones) and through the net, which do exactly that. I don't know, why... Perhaps sometimes simply copied over and over without much thinking...

Guess what happens if you call `remove(transaction)` still having "cascade ALL" in that @ManyToOne? The `account` (btw, with all other transactions!) will be deleted from the DB as well. But that wasn't your intention, was it?

https://stackoverflow.com/questions/13370221/persistentobjectexception-detached-entity-passed-to-persist-thrown-by-jpa-and-h



Spring security - This application has no explicit mapping for /error, so you are seeing this as a fallback.

After login wit credentials login: user, pwd: ![image-20210402091003794](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210402091003794.png)

still content is not displayed, try to add in application.properties : 

```properties
server.session.tracking-modes=cookie
```

