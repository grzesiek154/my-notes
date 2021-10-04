# 1. Spring IoC Container and Beans

@SpringBootApplication annotation clearly signifies that this is a Spring Boot appli-cation. But there’s more to @SpringBootApplication than meets the eye.@SpringBootApplication  is  a  composite  application  that  combines  three  otherannotations:

- @SpringBootConfiguration—Designates  this  class  as  a  configuration  class. Although  there’s  not  much  configuration  in  the  class  yet,  you  can  add  Java-based Spring Framework configuration to this class if you need to. This annota-tion is, in fact, a specialized form of the @Configuration annotation.
- @EnableAutoConfiguration—Enables  Spring  Boot  automatic  configuration.We’ll talk more about autoconfiguration later. For now, know that this annota-tion tells Spring Boot to automatically configure any components that it thinksyou’ll need.
- @ComponentScan—Enables  component  scanning.  This  lets  you  declare  otherclasses  with  annotations  like  @Component, @Controller, @Service,  and  others,to have Spring automatically discover them and register them as components inthe Spring application context.
- `@EnableWebMvc`: Flags the application as a web application and activates key behaviors, such as setting up a `DispatcherServlet`. Spring Boot adds it automatically when it sees `spring-webmvc` on the classpath.

# 2. Spring Container and Beans

At its core, Spring offers a container, often referred to as the Spring application con-
text, that creates and manages application components. These components, or beans,
are wired together inside the Spring application context to make a complete applica-
tion, much like bricks, mortar, timber, nails, plumbing, and wiring are bound together
to make a house.
The act of wiring beans together is based on a pattern known as dependency injection
(DI). Rather than have components create and maintain the lifecycle of other beans
that they depend on, a dependency-injected application relies on a separate entity
(the container) to create and maintain all components and inject those into the beans
that need them. This is done typically through constructor arguments or property
accessor methods.

```java
@Configuration
public class ServiceConfiguration {
@Bean
public InventoryService inventoryService() {
return new InventoryService();
}
@Bean
public ProductService productService() {
return new ProductService(inventoryService());
}
}
```

The @Configuration annotation indicates to Spring that this is a configuration classthat will provide beans to the Spring application context. The configuration’s class meth-ods are annotated with @Bean, indicating that the objects they return should be addedas beans in the application context (where, by default, their respective bean IDs willbe the same as the names of the methods that define them).

## Automatic configuration

Automatic configuration has its roots in the Spring techniques known as autowiring and component scanning. With component scanning, Spring can automatically discover components from an application’s classpath and create them as beans in the Spring application context. With autowiring, Spring automatically injects the components with the other beans that they depend on.

# 3. @Configuration annotation

Spring @Configuration annotation allows us to use annotations for [dependency injection](https://www.journaldev.com/2410/spring-dependency-injection). Let’s understand how to create Spring Configuration classes.

  

Let’s create a simple java bean class.

```java
package com.journaldev.spring;

public class MyBean {

	public MyBean() {
		System.out.println("MyBean instance created");
	}
	
}
```

Before we use any of the Spring framework classes, we will have to add it’s dependencies to the maven project.

```java
<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-context</artifactId>
		<version>5.0.6.RELEASE</version>
</dependency>
```

Now let’s create the Spring Configuration class.

```java
package com.journaldev.spring;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyConfiguration {

    @Bean
    public MyBean myBean() {
		return new MyBean();
	}
	
}
```

Let’s write a simple class and configure our simple Spring configuration class.

et’s write a simple class and configure our simple Spring configuration class.

```
package com.journaldev.spring;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MySpringApp {

	public static void main(String[] args) {
		AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
		ctx.register(MyConfiguration.class);
		ctx.refresh();

		// MyBean mb1 = ctx.getBean(MyBean.class);

		// MyBean mb2 = ctx.getBean(MyBean.class);

		ctx.close();
	}

}
```

If you run above application, it will produce output like this:

```
May 23, 2018 12:34:54 PM org.springframework.context.support.AbstractApplicationContext prepareRefresh
INFO: Refreshing org.springframework.context.annotation.AnnotationConfigApplicationContext@ff5b51f: startup date [Wed May 23 12:34:54 IST 2018]; root of context hierarchy
MyBean instance created
May 23, 2018 12:34:54 PM org.springframework.context.support.AbstractApplicationContext doClose
INFO: Closing org.springframework.context.annotation.AnnotationConfigApplicationContext@ff5b51f: startup date [Wed May 23 12:34:54 IST 2018]; root of context hierarchy
```

Notice that Spring loads beans into it’s context before  we have even requested it. This is to make sure all the beans are  properly configured and application fail-fast if something goes wrong.

Also `ctx.refresh()` must be called, otherwise we will get following error when we will try to get any bean from the context.

```
Exception in thread "main" java.lang.IllegalStateException: org.springframework.context.annotation.AnnotationConfigApplicationContext@f0f2775 has not been refreshed yet
	at org.springframework.context.support.AbstractApplicationContext.assertBeanFactoryActive(AbstractApplicationContext.java:1076)
	at org.springframework.context.support.AbstractApplicationContext.getBean(AbstractApplicationContext.java:1106)
	at com.journaldev.spring.MySpringApp.main(MySpringApp.java:11)
```

If you uncomment the statements where I am getting  MyBean instances, you will notice that it’s not calling the constructor  of MyBean. It’s because the default scope of [spring beans](https://www.journaldev.com/2461/spring-ioc-bean-example-tutorial) is Singleton. We can change it using `@Scope` annotation.

## What if we remove @Configuration annotation?

What will happen if we remove the @Configuration annotation from  MyConfiguration class. You will notice that it still works as expected  and spring beans are registered and retrieved as singleton classes. But  in this case, if we make a call to `myBean()` method then it  will be a plain java method call and we will get a new instance of  MyBean and it won’t remain singleton. To prove this point, let’s define  another bean that will be using MyBean instance.

```java
package com.journaldev.spring;

public class MyBeanConsumer {

	public MyBeanConsumer(MyBean myBean) {
		System.out.println("MyBeanConsumer created");
		System.out.println("myBean hashcode = "+myBean.hashCode());
	}

}
```

Our updated Spring Configuration class is:

```java
package com.journaldev.spring;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//@Configuration
public class MyConfiguration {

	@Bean
    public MyBean myBean() {
		return new MyBean();
	}
	
	@Bean
    public MyBeanConsumer myBeanConsumer() {
		return new MyBeanConsumer(myBean());
	}
}
```

Now when we run the `MySpringApp` class, it generates following output.

```java
MyBean instance created
MyBean instance created
MyBeanConsumer created
myBean hashcode = 1647766367
```

So MyBean is not singleton anymore, now let’s annotate `MyConfiguration` with `@Configuration` annotation again and run the `MySpringApp` class. This time output will be like below.

```java
MyBean instance created
MyBeanConsumer created
myBean hashcode = 1095088856
```

So it’s better to use `@Configuration` annotation with configuration classes to make sure our spring container is behaving like the way we want it to.

If you don’t want to use @Configuration annotation for some weird reasons, we can still create our configuration class by not calling the `myBean()` method and rather using an instance variable of MyBean configured  through @Autowired annotation. Something like below code will work as  well.

```java
package com.journaldev.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//@Configuration
public class MyConfiguration {

	@Autowired
	MyBean myBean;
	
	@Bean
    public MyBean myBean() {
		return new MyBean();
	}
	
	@Bean
    public MyBeanConsumer myBeanConsumer() {
		return new MyBeanConsumer(myBean);
	}
}
```

# 4.Database initialization

https://docs.spring.io/spring-boot/docs/2.1.0.M1/reference/html/howto-database-initialization.html



# 5. Spring Data JPA

![image-20210824124618391](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210824124618391.png)

# 6. @Transactional

The `@Transactional` annotation is simply metadata that can be consumed by some runtime infrastructure that is `@Transactional`-aware and that can use the metadata to configure the appropriate beans with transactional behavior.

The `@Transactional` annotation is metadata that specifies that an interface, class, or method must have transactional semantics; for example, "*start a brand new read-only transaction when this method is invoked, suspending any existing transaction*". The default `@Transactional` settings are as follows:

- Propagation setting is `PROPAGATION_REQUIRED.`
- Isolation level is `ISOLATION_DEFAULT.`
- Transaction is read/write.
- Transaction timeout defaults to the default timeout of the underlying transaction system, or to none if timeouts are not supported.
- Any `RuntimeException` triggers rollback, and any checked `Exception` does not.

### JPA and Transaction Management

It's important to notice that JPA on itself does not provide any type of declarative transaction management. When using JPA outside of a dependency injection container, transactions need to be handled programatically by the developer:

```java
UserTransaction utx = entityManager.getTransaction(); 

try { 
    utx.begin(); 
    businessLogic();
    utx.commit(); 
} catch(Exception ex) { 
    utx.rollback(); 
    throw ex; 
} 
```

This way of managing transactions makes the scope of the transaction very clear in the code, but it has several disavantages:

- it's repetitive and error prone
- any error can have a very high impact
- errors are hard to debug and reproduce
- this decreases the readability of the code base
- What if this method calls another transactional method?

### Using Spring @Transactional

With Spring `@Transactional`, the above code gets reduced to simply this:

```java
@Transactional
public void businessLogic() {
... use entity manager inside a transaction ...
}
```

This is much more convenient and readable, and is currently the recommended way to handle transactions in Spring.

By using `@Transactional`, many important aspects such as transaction propagation are handled automatically. In this case if another transactional method is called by `businessLogic()`, that method will have the option of joining the ongoing transaction.

One potential downside is that this powerful mechanism hides what is going on under the hood, making it hard to debug when things don't work.

### What does `@Transactional` mean?

One of the key points about `@Transactional` is that there are two separate concepts to consider, each with it's own scope and life cycle:

- the persistence context
- the database transaction

The transactional annotation itself defines the scope of a single database transaction. The database transaction happens inside the scope of a*persistence context*.

The persistence context is in JPA the `EntityManager`, implemented internally using an Hibernate `Session` (when using Hibernate as the persistence provider).

The persistence context is just a synchronizer object that tracks the state of a limited set of Java objects and makes sure that changes on those objects are eventually persisted back into the database.

This is a very different notion than the one of a database transaction. One Entity Manager **can be used across several database transactions**, and it actually often is.

# 6. @PostConstruct and  *@PreDestroy*

## @PostConstruct

There are frequent situations when application requires to run custom code  while starting up. There are several ways how to do it in Spring Boot,  one of my favorites is to create *@Component* class  with method annotated with @PostConstruct . This simple component class  is scanned during Spring Boot application start and method annotated by  @PostConstruct is run just after all services initialized. Such startup  init component can inject / autowire custom managed services and use  them for initialization. This way we can, for example, inject [Spring Data](http://projects.spring.io/spring-data/) repository and do some data initialization in our application.

The following code example is minimum class skeleton for our startup init class. We  can have several @Component classes in our application with  @PostConstruct annotation available. All these are going to be run  during Spring Boot start up process.

```java
@Component
public class StartUpInit {  @Autowired
  CustomServiceExample customServiceExample;  @PostConstruct
  public void init(){
     // init code goes here
  }
}
```

##  *@PreDestroy*

A method annotated with *@PreDestroy* runs only once, just before Spring removes our bean from the application context.

Same as with *@PostConstruct*, the methods annotated with *@PreDestroy* can have any access level but can't be static.

```java
@Component
public class UserRepository {

    private DbConnection dbConnection;
    @PreDestroy
    public void preDestroy() {
        dbConnection.close();
    }
}
```

The purpose of this method should be to release resources or perform  any other cleanup tasks before the bean gets destroyed, for example  closing a database connection.