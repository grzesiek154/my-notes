A good rule of thumb is when QA tester finds a bug — developer should write a unit test before fixing the bug and then make it pass with the fix.

First, let’s cover the most common types of bugs (defects in the software).

## Types of bugs:

- **Business logic** (something isn’t right according to business requirements)
- **Security bugs** (the code is vulnerable to some security exploits)
- **Regression** (some code updates caused existing features to break)
- **Performance** (the code is slow or some actions execute extra functions)
- **Accessibility** (the code doesn’t meet aria spec for accessibility)
- **UI bugs** (user interface doesn’t meet the design specification)
- **Integration** (two or more components don’t work together as expected)

## **White box testing** is when we inspect the source code and verify it works according to the spec.

## **Black box testing** is when we don’t have access to the source code and only test external interface produced by the code.

## **Test pyramid**

When we’re talking about testing software in general we have to mention the **test pyramid**. The point of it is to show that unit tests are easy to write and we should have many of them, integration tests are more expensive and we should fewer of them, and end-to-end tests are the most involved and we should have very few of them. If an end-to-end test catches a bug it means something in the unit or integration test is missing.

![Image for post](https://miro.medium.com/max/452/1*d_P2fgQtvcjg-grM6TXV3w.png)

## Test Levels (proximity to the source code and the footprint of the test)

- **Unit testing.** Fast, low-level tests with small footprint written by developers to test stability of isolated units of code. For example, given an argument function should return the expected result. The goal is to test a unit of code (component, module, function) in isolation and in a meaningful way. It’s the least time consuming test, we should have many unit tests and few end-to-end tests. When writing unit tests, make sure assertions are running, starting with failing test and then working on the test to make it pass.
- **Integration testing**. Verifying if and how two or more components or modules integrate (talk to each other). Usually this kind of testing can be done by QA tester if it’s a black box testing or a developer if it involves more complex and technical integration like a database.
- **System testing (or end-to-end testing).** Is a complete system testing. When unit tests and integration tests are testing parts of the system, this one is targeting the system as a whole. This testing is performed by QA testers. For example testing an entire application from login to checkout and making sure emails are delivered. This is done from user perspective, and shouldn’t be automated with data mocks or fake requests. This type of testing is the most involved and time consuming. If a bug was discovered during E2E testing, that means something was missing in unit or integration testing.
- **Acceptance Testing** is a level of the software testing where a system is tested for acceptability. The purpose of this test is to evaluate the system’s compliance with the business requirements and assess whether it is acceptable for delivery.

# Test dependencies

```xml
 <dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
  <exclusions>
   <exclusion>
    <groupId>org.junit.vintage</groupId>
    <artifactId>junit-vintage-engine</artifactId>
   </exclusion>
  </exclusions>
 </dependency>
</dependencies>
```

org.springframework.boot - contains most of needed dependencies for testing

# Editing test method template 

![image-20210825074922260](C:\Users\gmalarski\AppData\Roaming\Typora\typora-user-images\image-20210825074922260.png)

# AssertJ library documentation

https://assertj.github.io/doc/