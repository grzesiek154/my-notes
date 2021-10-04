# Sources

https://reflectoring.io/spring-boot-mock/

https://reflectoring.io/unit-testing-spring-boot/



# Types of Mocks

### Plain Mockito Test

The plainest way to use Mockito is to simply instantiate a mock object using `Mockito.mock()` and then pass the so created mock object into the class under test:

```java
public class SendMoneyControllerPlainTest {

  private SendMoneyUseCase sendMoneyUseCase = 
      Mockito.mock(SendMoneyUseCase.class);

  private SendMoneyController sendMoneyController = 
      new SendMoneyController(sendMoneyUseCase);

  @Test
  void testSuccess() {
    // given
    SendMoneyCommand command = new SendMoneyCommand(1L, 2L, 500);
    given(sendMoneyUseCase
        .sendMoney(eq(command)))
        .willReturn(true);
  
    // when
    ResponseEntity response = sendMoneyController
        .sendMoney(1L, 2L, 500);
  
    // then
    then(sendMoneyUseCase)
        .should()
        .sendMoney(eq(command));
  
    assertThat(response.getStatusCode())
        .isEqualTo(HttpStatus.OK);
  }

}
```

We create a mock instance of `SendMoneyService` and pass this mock into the constructor of `SendMoneyController`. The controller doesn’t know that it’s a mock and will treat it just like the real thing.

In the test itself, we can use Mockito’s `given()` to define the behavior we want the mock to have and `then()` to check if certain methods have been called as expected. You can find more on Mockito’s mocking and verification methods in the [docs](https://static.javadoc.io/org.mockito/mockito-core/3.0.0/org/mockito/Mockito.html).



###  Using Mockito Annotations with JUnit Jupiter

With JUnit Jupiter, we need to apply the `MockitoExtension` to our test

```java
@ExtendWith(MockitoExtension.class)
class SendMoneyControllerMockitoAnnotationsJUnitJupiterTest {

  @Mock
  private SendMoneyUseCase sendMoneyUseCase;

  @InjectMocks
  private SendMoneyController sendMoneyController;

  @Test
  void testSuccess() {
    ...
  }

}
```

We can then use the `@Mock` and `@InjectMocks` annotations on fields of the test.

Fields annotated with `@Mock` will then automatically be initialized with a mock instance of their type, just like as we would call `Mockito.mock()` by hand.

Mockito will then try to instantiate fields annotated with `@InjectMocks` by passing all mocks into a constructor. Note that we need to provide such a constructor for Mockito to work reliably. If Mockito doesn’t find a constructor, it will try setter injection or field injection, but the cleanest way is still a constructor. 

#### `@Mock` annotation mocks the concerned object.

### `@InjectMocks` annotation allows to inject into the underlying object the different (and relevant) mocks created by `@Mock`.



###  Using Mockito Annotations with JUnit 4

With JUnit 4, it’s very similar, except that we need to use `MockitoJUnitRunner` instead of `MockitoExtension`:

```java
@RunWith(MockitoJUnitRunner.class)
public class SendMoneyControllerMockitoAnnotationsJUnit4Test {

  @Mock
  private SendMoneyUseCase sendMoneyUseCase;

  @InjectMocks
  private SendMoneyController sendMoneyController;

  @Test
  public void testSuccess() {
    ...
  }

}
```



##  Mocking with Mockito and Spring Boot



We may not want to test the integration between all the beans in a certain test, however, so we need a way to replace certain beans within Spring’s application context with a mock. Spring Boot provides the `@MockBean` and `@SpyBean` annotations for this purpose.

# Unit testing with Spring Boot

## Dependencies

For the unit test in this tutorial, we’ll use JUnit Jupiter (JUnit 5), Mockito, and  AssertJ. We’ll also include Lombok to reduce a bit of boilerplate code:

```
dependencies{
  compileOnly('org.projectlombok:lombok')
  testCompile('org.springframework.boot:spring-boot-starter-test')
  testCompile 'org.junit.jupiter:junit-jupiter-engine:5.2.0'
  testCompile('org.mockito:mockito-junit-jupiter:2.23.0')
}
```

Mockito and AssertJ are automatically imported with the `spring-boot-starter-test` dependency, but we’ll have to include Lombok ourselves.

## Don’t Use Spring in Unit Tests

If you have written tests with Spring or Spring Boot in the past, **you’ll probably say that we don’t need Spring to write unit tests**. Why is that?

Consider the following “unit” test that tests a single method of the `RegisterUseCase` class:

```java
@ExtendWith(SpringExtension.class)
@SpringBootTest
class RegisterUseCaseTest {

  @Autowired
  private RegisterUseCase registerUseCase;

  @Test
  void savedUserHasRegistrationDate() {
    User user = new User("zaphod", "zaphod@mail.com");
    User savedUser = registerUseCase.registerUser(user);
    assertThat(savedUser.getRegistrationDate()).isNotNull();
  }

}
```

This test takes about 4.5 seconds to run on an empty Spring project on my computer.

**But a good unit test only takes milliseconds.** Otherwise it hinders the “test / code / test” flow promoted by the idea of Test-Driven Development (TDD). But even when we’re not practicing TDD, waiting on a test that takes too long ruins our concentration.

Execution of the test method above actually only takes milliseconds. The rest of the 4.5 seconds is due to the `@SpringBootRun`  telling Spring Boot to set up a whole Spring Boot application context.

**So we have started the whole application only to autowire a `RegisterUseCase` instance into our test**. It will take even longer once the application gets bigger and Spring has to load more and more beans into the application context.

So, why this article when we shouldn’t use Spring Boot in a unit test? To be honest, most of this tutorial is about writing unit tests *without* Spring Boot.

## Creating a Testable Spring Bean

However, there are some things we can do to make our Spring beans better testable.

### Field Injection is Evil

Let’s start with a bad example. Consider the following class:

```java
@Service
public class RegisterUseCase {

  @Autowired
  private UserRepository userRepository;

  public User registerUser(User user) {
    return userRepository.save(user);
  }

}
```

This class cannot be unit tested without Spring because it provides no way to pass in a `UserRepository` instance. Instead, we need to write the test in the way discussed in the previous section to let Spring create a `UserRepository` instance and inject it into the field annotated with `@Autowired`.

**The lesson here is not to use field injection.**

### Providing a Constructor

Actually let’s not use the `@Autowired` annotation at all:

```java
@Service
public class RegisterUseCase {

  private final UserRepository userRepository;

  public RegisterUseCase(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User registerUser(User user) {
    return userRepository.save(user);
  }

}
```

This version allows [constructor injection](https://reflectoring.io/constructor-injection) by providing a constructor that allows to pass  in a `UserRepository` instance. In the unit test, we can now create such an instance (perhaps a mock instance as we’ll discuss later) and pass it into the constructor.

Spring will automatically use this constructor to instantiate a `RegisterUseCase` object when creating the production application context. Note that prior to Spring 5, we need to add the `@Autowired` annotation to the constructor for Spring to find the constructor.

Also note that the `UserRepository` field is now `final`. This makes sense, since the field content  won’t ever change during the lifetime of an application. It also helps to avoid programming errors, because the compiler will complain if we have forgotten to initialize the field.

### Reducing Boilerplate Code

Using Lombok’s [`@RequiredArgsConstructor`](https://projectlombok.org/features/constructor) annotation we can let the constructor be automatically generated:

```java
@Service
@RequiredArgsConstructor
public class RegisterUseCase {

  private final UserRepository userRepository;

  public User registerUser(User user) {
    user.setRegistrationDate(LocalDateTime.now());
    return userRepository.save(user);
  }

}
```

Now, we have a very concise class without boilerplate code that can be instantiated easily in  a plain java test case:

```java
class RegisterUseCaseTest {

  private UserRepository userRepository = ...;

  private RegisterUseCase registerUseCase;

  @BeforeEach
  void initUseCase() {
    registerUseCase = new RegisterUseCase(userRepository);
  }

  @Test
  void savedUserHasRegistrationDate() {
    User user = new User("zaphod", "zaphod@mail.com");
    User savedUser = registerUseCase.registerUser(user);
    assertThat(savedUser.getRegistrationDate()).isNotNull();
  }

}
```

There’s a piece missing, yet, and that is how to mock away the `UserRepository` instance our class under test depends on, because we don’t want to rely on the real thing, which probably needs a connection to a database.

## Using Mockito to Mock Dependencies

The de-facto standard mocking library nowadays is [Mockito](https://site.mockito.org/). It provides at least two ways to create a mocked `UserRepository` to fill the blank in the previous code example.

### Mocking Dependencies with Plain Mockito

The first way is to just use Mockito programmatically:

```java
private UserRepository userRepository = Mockito.mock(UserRepository.class);
```

This will create an object that looks like a `UserRepository` from the outside. **By default, it will do nothing when a method is called and return `null` if the method has a return value**.

Our test would now fail with a `NullPointerException` at `assertThat(savedUser.getRegistrationDate()).isNotNull()` because `userRepository.save(user)` now returns `null`.

So, we have to tell Mockito to return something when `userRepository.save()` is called. We do this with the static `when` method:

```java
@Test
void savedUserHasRegistrationDate() {
  User user = new User("zaphod", "zaphod@mail.com");
  when(userRepository.save(any(User.class))).then(returnsFirstArg());
  User savedUser = registerUseCase.registerUser(user);
  assertThat(savedUser.getRegistrationDate()).isNotNull();
}
```

This will make `userRepository.save()` return the same user object that is passed into the method.

Mockito has a whole lot more features that allow for mocking, matching arguments and verifying method calls. For more information have a look at  the [reference documentation](https://static.javadoc.io/org.mockito/mockito-core/2.23.4/org/mockito/Mockito.html).

## Mocking Dependencies with Mockito’s `@Mock` Annotation

An alternative way of creating mock objects is Mockito’s `@Mock` annotation in combination with  the `MockitoExtension` for JUnit Jupiter:

```java
@ExtendWith(MockitoExtension.class)
class RegisterUseCaseTest {

  @Mock
  private UserRepository userRepository;

  private RegisterUseCase registerUseCase;

  @BeforeEach
  void initUseCase() {
    registerUseCase = new RegisterUseCase(userRepository);
  }

  @Test
  void savedUserHasRegistrationDate() {
    // ...
  }

}
```

The `@Mock` annotation specifies the fields in which Mockito should inject mock objects. The `@MockitoExtension` tells Mockito to evaluate those `@Mock` annotations because JUnit does not do this automatically.

The result is the same as if calling `Mockito.mock()` manually, it’s a matter of taste which way to use. Note, though, that by using `MockitoExtension` our tests are bound to the test framework.

Note that instead of constructing an `RegisterUseCase` object manually, we can just as well use the `@InjectMocks`  annotation on the `registerUseCase` field. Mockito will then create an instance for us, following a specified [algorithm](https://static.javadoc.io/org.mockito/mockito-core/2.23.4/org/mockito/InjectMocks.html):

```java
@ExtendWith(MockitoExtension.class)
class RegisterUseCaseTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private RegisterUseCase registerUseCase;

  @Test
  void savedUserHasRegistrationDate() {
    // ...
  }

}
```

## Creating Readable Assertions with AssertJ

Another library that comes automatically with the Spring Boot test support is [AssertJ](http://joel-costigliola.github.io/assertj/). We have already used it above to implement our assertion:

```java
assertThat(savedUser.getRegistrationDate()).isNotNull();
```

However, wouldn’t it be nice to make the assertion even more readable? Like this, for example:

```java
assertThat(savedUser).hasRegistrationDate();
```

There are many cases where small changes like this make the test so much better to understand. So, let’s create our own [custom assertion](http://joel-costigliola.github.io/assertj/assertj-core-custom-assertions.html) **in the test sources folder**:

```java
class UserAssert extends AbstractAssert<UserAssert, User> {

  UserAssert(User user) {
    super(user, UserAssert.class);
  }

  static UserAssert assertThat(User actual) {
    return new UserAssert(actual);
  }

  UserAssert hasRegistrationDate() {
    isNotNull();
    if (actual.getRegistrationDate() == null) {
      failWithMessage(
        "Expected user to have a registration date, but it was null"
      );
    }
    return this;
  }
}
```

Now, if we import the `assertThat` method from the new `UserAssert` class instead from the AssertJ library, we can use the new, easier to read assertion.

Creating a custom assertion like this may seem like a lot of work, but it’s actually done in a couple minutes. I believe strongly that it’s worth to invest these minutes to create readable test code, even if it’s only marginally better readable afterwards. **We only write the test code \*once\*, after all, and others (including “future me”) have to read, understand and then manipulate the code many, many times during the lifetime of the software**.





# Spring controller testing concepts and examples

```java
@RestController
@RequiredArgsConstructor
class RegisterRestController {
  private final RegisterUseCase registerUseCase;

  @PostMapping("/forums/{forumId}/register")
  UserResource register(
          @PathVariable("forumId") Long forumId,
          @Valid @RequestBody UserResource userResource,
          @RequestParam("sendWelcomeMail") boolean sendWelcomeMail) {

    User user = new User(
            userResource.getName(),
            userResource.getEmail());
    Long userId = registerUseCase.registerUser(user, sendWelcomeMail);

    return new UserResource(
            userId,
            user.getName(),
            user.getEmail());
  }

}
```

The controller method is annotated with `@PostMapping` to define the URL, HTTP method and content type it should listen to.

It takes input via parameters annotated with `@PathVariable`, `@RequestBody`, and `@RequestParam` which are automatically filled from the incoming HTTP request.

Parameters my be annotated with `@Valid` to indicate that Spring should perform [bean validation](https://reflectoring.io/bean-validation-with-spring-boot/) on them.

The controller then works with those parameters, calling the business logic before returning a plain Java object, which is automatically mapped into JSON and written into the HTTP response body by default.

There’s a lot of Spring magic going on here. In summary, for each request, a controller usually does the following steps:

| #    | Responsibility              | Description                                                  |
| :--- | :-------------------------- | :----------------------------------------------------------- |
| 1.   | **Listen to HTTP Requests** | The controller should respond to certain URLs, HTTP methods and content types. |
| 2.   | **Deserialize Input**       | The controller should parse the incoming HTTP request and create Java objects from variables in the URL, HTTP request parameters and the request body so that we can work with them in the code. |
| 3.   | **Validate Input**          | The controller is the first line of defense against bad input, so it’s a place where we can validate the input. |
| 4.   | **Call the Business Logic** | Having parsed the input, the controller must transform the input into the model expected by the business logic and pass it on to the business logic. |
| 5.   | **Serialize the Output**    | The controller takes the output of the business logic and serializes it into an HTTP response. |
| 6.   | **Translate Exceptions**    | If an exception occurs somewhere on the way, the controller should translate it into a meaningful error message and HTTP status for the user. |

## Unit or Integration Test?

Do we write unit tests? Or integration tests? What’s the difference, anyways? Let’s discuss both approaches and decide for one.

**In a unit test, we would test the controller in isolation**. That means we would instantiate a controller object, [mocking away the business logic](https://reflectoring.io/unit-testing-spring-boot/#using-mockito-to-mock-dependencies), and then call the controller’s methods and verify the response.

Would that work in our case? Let’s check which of the 6 responsibilities we have identified above we can cover in an isolated unit test:

| #    | Responsibility              | Covered in a Unit Test?                                      |
| :--- | :-------------------------- | :----------------------------------------------------------- |
| 1.   | **Listen to HTTP Requests** | No, because the unit test would not evaluate the `@PostMapping` annotation and similar annotations specifying the properties of a HTTP request. |
| 2.   | **Deserialize Input**       | No, because annotations like `@RequestParam` and `@PathVariable` would not be evaluated. Instead we would provide the input as Java objects, effectively skipping deserialization from an HTTP request. |
| 3.   | **Validate Input**          | Not when depending on bean validation, because the `@Valid` annotation would not be evaluated. |
| 4.   | **Call the Business Logic** | Yes, because we can verify if the mocked business logic has been called with the expected arguments. |
| 5.   | **Serialize the Output**    | No, because we can only verify the Java version of the output, and not the HTTP response that would be generated. |
| 6.   | **Translate Exceptions**    | No. We could check if a certain exception was raised, but not that it was translated to a certain JSON response or HTTP status code. |

In summary, **a simple unit test will not cover the HTTP layer**. So, we need to introduce Spring to our test to do the HTTP magic for us. Thus, we’re building an integration test that tests the integration between our controller code and the components Spring provides for HTTP support.

An integration test with Spring fires up a Spring application context that contains all the beans we need. This includes framework beans that are responsible for listening to certain URLs, serializing and deserializing to and from JSON and translating exceptions to HTTP. These beans will evaluate the annotations that would be ignored by a simple unit test.

## Annotations often used in tests

### @RunWith(SpringRunner.class)

`SpringRunner` is an *alias* for the [`SpringJUnit4ClassRunner`](https://docs.spring.io/spring-framework/docs/5.2.10.RELEASE/javadoc-api/org/springframework/test/context/junit4/SpringJUnit4ClassRunner.html).

To use this class, simply annotate a JUnit 4 based test class with `@RunWith(SpringRunner.class)`.

If you would like to use the Spring TestContext Framework with a runner other than this one, use [`SpringClassRule`](https://docs.spring.io/spring-framework/docs/5.2.10.RELEASE/javadoc-api/org/springframework/test/context/junit4/rules/SpringClassRule.html) and [`SpringMethodRule`](https://docs.spring.io/spring-framework/docs/5.2.10.RELEASE/javadoc-api/org/springframework/test/context/junit4/rules/SpringMethodRule.html).

 In JUnit 5 **the \*@RunWith\* annotation has been replaced by the more powerful \*@ExtendWith\* annotation**.

However, the *@RunWith* annotation can still be used in JUnit5 for the sake of the backward compatibility.

## Common annotations

### *@Mock* 

This annotation is a shorthand for the *Mockito.mock()* method. As well, we should only use it in a test class. Unlike the *mock()* method, we need to enable Mockito annotations to use this annotation.

We can do this either by using the *MockitoJUnitRunner* to run the test or calling the *MockitoAnnotations.initMocks()* method explicitly.

Let's look at an example using *MockitoJUnitRunner*:

```java
@RunWith(MockitoJUnitRunner.class)
public class MockAnnotationUnitTest {
@Mock
UserRepository mockRepository;

@Test
public void givenCountMethodMocked_WhenCountInvoked_ThenMockValueReturned() {
    Mockito.when(mockRepository.count()).thenReturn(123L);
 
    long userCount = mockRepository.count();
 
    Assert.assertEquals(123L, userCount);
    Mockito.verify(mockRepository).count();
	}
}
```


### *@MockBean*

We can use the *@MockBean* to add mock objects to the Spring application context. The mock will replace any existing bean of the same type in the application context.

If no bean of the same type is defined, a new one will be added. This annotation is useful in integration tests where a particular bean – for example, an external service – needs to be mocked.

To use this annotation, we have to use *SpringRunner* to run the test:

```java
@RunWith(SpringRunner.class)
public class MockBeanAnnotationIntegrationTest {
    
    @MockBean
    UserRepository mockRepository;
    
    @Autowired
    ApplicationContext context;
    
    @Test
    public void givenCountMethodMocked_WhenCountInvoked_ThenMockValueReturned() {
        Mockito.when(mockRepository.count()).thenReturn(123L);
     
        UserRepository userRepoFromContext = context.getBean(UserRepository.class);
        long userCount = userRepoFromContext.count();
     
        Assert.assertEquals(123L, userCount);
        Mockito.verify(mockRepository).count();
    }

}
```

When we use the annotation on a field, as well as being registered in the application context, the mock will also be injected into the field.

###  @SpringBootTest

 @SpringBootTest are tasked to load the Spring application context for the test,they  won’t  have  anything  to  do  if  there  aren’t  any  test  methods.  Even  without  anyassertions or code of any kind, this empty test method will prompt the two annotationsto do their job and load the Spring application context. If there are any problems indoing so, the test fails.

The `@SpringBootTest` annotation tells Spring Boot to look for a main configuration class (one with `@SpringBootApplication`, for instance) and use that to start a Spring application context. You  can run this test in your IDE or on the command line (by running `./mvnw test` or `./gradlew test`), and it should pass. To convince yourself that the context is creating  your controller, you could add an assertion, as the following example  (from 

### @WebMvcTest

@WebMvcTest  also  sets  up  Spring  support  for  testing  Spring  MVC.  Although  itcould be made to start a server, mocking the mechanics of Spring MVC is sufficient foryour purposes. The test class is injected with a MockMvc object for the test to drive themockup

![image-20201106101503337](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20201106101503337.png)