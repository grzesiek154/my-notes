# 1. Explain JDK, JRE and JVM?

| **JDK**                                                      | **JRE**                                                      | **JVM**                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| It stands for Java Development Kit.                          | It stands for Java Runtime Environment.                      | It stands for Java Virtual Machine.                          |
| It is the tool necessary to compile, document and package Java programs. | JRE refers to a runtime environment in which Java bytecode can be executed. | It is an abstract machine. It is a specification that provides a run-time environment in which Java bytecode can be executed. |
| It contains JRE + development tools.                         | It’s an implementation of the JVM which physically exists.   | JVM follows three notations: Specification, **Implementation,** and **Runtime Instance**. |

# **2. What all does JVM comprise of?**

![image-20210906075732377](C:\Projects\my-projects\SpringProjects\NotesAndOther\JavaInterview\img\image-20210906075732377.png)

## **Classes & Meta-data** 

Classes! Java has classes, this is easy! Classes form a tree, rooted at Object. They have a super-class and some subclasses (and interfaces). They have fields and methods. They are initialized (or not), and the <clinit> has run (or not). They might have inner classes, or be “Single Abstract Method”. They have instances. They can be abstract or have custom Loaders or Security Domains or annotations or... Meta-data! There is also internal meta-data, not available via reflection. Object field layout: offset & size. Padding. Profiling data on methods, but also on fields, locks, exceptions. JIT’d code. Safepoints and OopMaps. GC and heap-walking support, and much more.

![image-20210906081321779](C:\Projects\my-projects\SpringProjects\NotesAndOther\JavaInterview\img\image-20210906081321779.png)

### Single Abstract Method (SAM) and Functional Interface in Java

Interface that has single abstract method (**SAM**), is known as functional interface. We can supply a lambda expression whenever an object of an functional interface is expected.

Example of functional interface:

Callable is a FunctionalInterface

```java
package java.util.concurrent;

@FunctionalInterface    
public interface Callable<V> {

    V call() throws Exception;
}
```

The compiler will treat any interface meeting the definition of a functional interface as a functional interface regardless of whether or not a FunctionalInterface annotation is present on the interface declaration.

Callable using lambda expression

```java
Callable<String> aCallable = () -> "dummy";
```

Another example of SAM using lambda

```java
class Worker {
    ExecutorService executor = Executors.newSingleThreadExecutor();

    public<T> Future<T> invoke(Callable<T> runnable) {
        return executor.submit(runnable);
    }
}

class Client {
    public void execute() {
        Worker worker = new Worker();
        worker.invoke(() -> {
            System.out.println("this is an lambda work");
            return "result";
        });
    }
```

## Data and the Heap

 Data is stored in Objects, and Objects are stored in the Heap. Objects are made with ‘new’ and reclaimed with GC. The Heap probably is the largest user of your machine resources. Working with those Objects probably uses most of you dev cycles.

![image-20210906083304012](C:\Projects\my-projects\SpringProjects\NotesAndOther\JavaInterview\img\image-20210906083304012.png)

The mutator (Java program) “pumps” memory from Free to Live. GC “pumps” memory from Live to Free. These two forces must balance out (or you die Out of Memory), But they have different CPU costs. The allocation rate (and CPU cost) is up to the developer. The GC costs depend on the structure of the heap, and that structure is also up to the developer. But always, fewer objects & pointers cost less than more of either. A million Longs are hugely more expensive than a single long[1000000].


## **Bytecodes and an Execution Model**

![image-20210906083712264](C:\Projects\my-projects\SpringProjects\NotesAndOther\JavaInterview\img\image-20210906083712264.png)

Since no real machine runs this, the java virtual machine emulates it. The interpreter runs one bytecode at a time, and is fairly slow. But it can start immediately! The interpreter also profiles: it counts functions (and loops), and when the count is large enough, it triggers a compilation. The Just In Time compiler, or JIT, compiles hot bytecodes into real machine code. The JIT’d code runs about 10 times faster than the interpreter.

The JVM Runtime The JVM Runtime is basically a “catch all” for everything else. The runtime tracks: 

- Threads & thread stacks - Classes loaded 
- State of the Heap, and triggers GC as needed 
- Profiled code, and triggers JIT’ing when needed 
- Catches hardware exceptions and turns them into JVM exceptions 
- Handles slow-path locking, blocking & waking threads
- Handles I/O and native calls - … and much much more Runtime



## Compiler

![image-20210906092542370](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210906092542370.png)

## Virtual Machine

![image-20210906092644962](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210906092644962.png)



# 3 Big O

Big O time is the language and metric we use to describe the efficiency of algorithms. Not understanding it thoroughly can really hurt you in developing an algorithm. Not only might you be judged harshly for not really understanding big 0, but you will also struggle to judge when your algorithm is getting faster or slower

This is what the concept of asymptotic runtime, or big O time, means. We could describe the data transfer "algorithm" runtime as:

- Electronic Transfer: 0( s ), where s is the size of the file. This means that the time to transfer the file
  increases linearly with the size of the file. (Yes, this is a bit of a simplification, but that's okay for these
  purposes.)
- Airplane Transfer: 0( 1) with respect to the size of the file. As the size of the file increases, it won't take any longer to get the file to your friend. The time is constant.

# 4 OOP concepts

## Polymorphism

Polymorphism means "many forms", and it occurs when we have many classes that are related to each other by inheritance.

Like we specified in the previous chapter;  [**Inheritance**](https://www.w3schools.com/java/java_inheritance.asp) lets us  inherit attributes and methods from another class. **Polymorphism**  uses those methods to perform different tasks. This allows us to perform a single  action in different ways.

For example, think of a superclass called `Animal` that has a method called `animalSound()`. Subclasses of Animals could be Pigs, Cats, Dogs, Birds - And they also  have their own implementation of an animal sound (the pig oinks, and the cat meows, etc.):

### **Static polymorphism**

Java, like many other object-oriented programming languages, allows  you to implement multiple methods within the same class that use the  same name but a different set of parameters. That is called [method overloading](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html) and represents a static form of polymorphism.

The parameter sets have to differ in at least one of the following three criteria:

- They need to have a different number of parameters, e.g. one method accepts 2 and another one 3 parameters.
- The types of the parameters need to be different, e.g. one method accepts a *String* and another one a *Long.*
- They need to expect the parameters in a different order, e.g. one method accepts a *String* and a *Long* and another one accepts a *Long* and a *String*. This kind of overloading is not recommended because it makes the API difficult to understand.

In most cases, each of these overloaded methods provides a different but very similar functionality.

Due to the different sets of parameters, each method has a different [signature](https://www.thoughtco.com/method-signature-2034235). That allows the compiler to identify which method has to be called and  to bind it to the method call. This approach is called static binding or static polymorphism.

### **Runtime or Dynamic Polymorphism**

In the Dynamic Polymorphism, a call  to a single overridden method is solved during a program’s runtime.  Method overriding is one of the prominent examples of Runtime  Polymorphism. In this process, the overriding is done through pointers  and virtual functions.

- In Method  Overriding, a single method is declared in a sub-class present in a  parent class. The child class gains a method for implementation.
- During  Runtime Polymorphism, the class offers the specification of its own to  another inherited method. This transfer between methods is achieved  without modifying the parent class object codes.

## Association

Association represents the relationship between the objects. Here,  one object can be associated with one object or many objects. There can  be four types of association between the objects:

- One to One
- One to Many
- Many to One, and
- Many to Many

Let's understand the relationship with real-time examples. For  example, One country can have one prime minister (one to one), and a  prime minister can have many ministers (one to many). Also, many MP's  can have one prime minister (many to one), and many ministers can have  many departments (many to many).

Association can be undirectional or bidirectional.

## Aggregation

Aggregation is a way to achieve Association. Aggregation represents  the relationship where one object contains other objects as a part of  its state. It represents the weak relationship between objects. It is  also termed as a *has-a* relationship in Java. Like, inheritance represents the *is-a* relationship. It is another way to reuse objects.

## Composition

The composition is also a way to achieve Association. The composition represents the relationship where one object contains other objects as a part of its state. There is a strong relationship between the  containing object and the dependent object. It is the state where  containing objects do not have an independent existence. If you delete  the parent object, all the child objects will be deleted automatically. 

# 4 Data structures

## Array

https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html

An *array* is a container object that holds a fixed number of  values of a single type. The length of an array is established when the  array is created. After creation, its length is fixed. You have seen an  example of arrays already, in the `main` method of the "Hello World!" application. This section discusses arrays in greater detail.

## String pool

###  **What is Java String Pool?**

Java String pool refers to a collection of Strings which are stored in heap  memory. In this, whenever a new object is created, String pool first  checks whether the object is already present in the pool or not. If it  is present, then the same reference is returned to the variable else new object will be created in the String pool and the respective reference  will be returned.

**![String pool - Java Interview Questions - Edureka](https://www.edureka.co/blog/content/ver.1556012641/uploads/2019/04/String-pool.png)**

## Linked list

A linked list is a data structure that represents a sequence of nodes. In a singly linked list, each node points to the next node in the linked list. A doubly linked list gives each node pointers to both the next node and the previous node.

 Unlike an array, a linked list does not provide constant time access to a particular "index" within the list. This means that if you'd like to find the Kth element in the list, you will need to iterate through K elements. The benefit of a linked list is that you can add and remove items from the beginning of the list in constant time. For specific applications, this can be useful.

## Linked list vs Array List

![image-20210907152853174](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210907152853174.png)

![https://www.programcreek.com/wp-content/uploads/2013/03/arraylist-vs-linkedlist-complexity.png](https://www.programcreek.com/wp-content/uploads/2013/03/arraylist-vs-linkedlist-complexity.png)

# Stack

In programming, a stack is an abstract, linear data type with a  predefined capacity (or boundary). It follows a particular order for  adding or removing elements. Linear data structures organize their  components in a straight line, so if we we add or remove an element,  they will grow or shrink respectively.

The stack data structure is precisely what it sounds like: a stack of data. In certain types of problems, it can be favorable to store data in a stack rather than in an array. A stack uses LIFO (last-in first-out) ordering. That is, as in a stack of dinner plates, the most recent item added to the stack is the first item to be removed.
It uses the following operations:

- pop ( ) : Remove the top item from the stack.

- push ( i tern): Add an item to the top of the stack.

- peek(): Return the top of the stack.

- is Empty (): Return true if and only if the stack is empty.

  

  Unlike an array, a stack does not offer constant-time access to the i th item. However, it does allow constanttimeadds and removes, as it doesn't require shifting elements around.

  One case where stacks are often useful is in certain recursive algorithms. Sometimes you need to push temporary data onto a stack as you recurse, but then remove them as you backtrack (for example, because the recursive check failed). A stack offers an intuitive way to do this.

data structure and big o

# 4 Base design patterns

## Singleton

The Singleton pattern ensures that a class has only one instance and ensures access to the instance through the application. It can be useful in cases where you have a "global" object with exactly one instance. For example, we may want to implement Restaurant such that it has exactly one instance of Restaurant.

It should be noted that many people dislike the Singleton design pattern, even calling it an "anti-pattern:' One reason for this is that it can interfere with unit testing.

```java
// The Database class defines the `getInstance` method that lets
// clients access the same instance of a database connection
// throughout the program.
class Database is
    // The field for storing the singleton instance should be
    // declared static.
    private static field instance: Database

    // The singleton's constructor should always be private to
    // prevent direct construction calls with the `new`
    // operator.
    private constructor Database() is
        // Some initialization code, such as the actual
        // connection to a database server.
        // ...

    // The static method that controls access to the singleton
    // instance.
    public static method getInstance() is
        if (Database.instance == null) then
            acquireThreadLock() and then
                // Ensure that the instance hasn't yet been
                // initialized by another thread while this one
                // has been waiting for the lock's release.
                if (Database.instance == null) then
                    Database.instance = new Database()
        return Database.instance

    // Finally, any singleton should define some business logic
    // which can be executed on its instance.
    public method query(sql) is
        // For instance, all database queries of an app go
        // through this method. Therefore, you can place
        // throttling or caching logic here.
        // ...

class Application is
    method main() is
        Database foo = Database.getInstance()
        foo.query("SELECT ...")
        // ...
        Database bar = Database.getInstance()
        bar.query("SELECT ...")
        // The variable `bar` will contain the same object as
        // the variable `foo`.
```

5 functional interfaces and streams

