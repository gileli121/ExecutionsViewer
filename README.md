# ExecutionsViewer
ExecutionsViewer - Deploy, Host, and view your JUnit 5 tests reports in an external reporting tool


# Screenshots
![image](https://user-images.githubusercontent.com/17680514/129592198-dbbdd66f-fa89-441c-ab11-31810d84df6f.png)
![image](https://user-images.githubusercontent.com/17680514/129592240-a89792b9-0e25-44fe-88b0-eb8fb1a9de50.png)
![image](https://user-images.githubusercontent.com/17680514/129592328-a79a4b61-7828-4c47-89a1-b4a477e82b1d.png)
![image](https://user-images.githubusercontent.com/17680514/129417972-5238bb6e-9779-4ce7-8ae1-c49fe0aac617.png)
![image](https://user-images.githubusercontent.com/17680514/129444686-f20c6ae7-a708-42f2-8657-032f55c220ae.png)
![image](https://user-images.githubusercontent.com/17680514/129592445-21c4aa85-599d-4b70-9a0a-8d38da97e963.png)
![image](https://user-images.githubusercontent.com/17680514/129592668-fd7f4301-d54c-41cb-aeb2-db9edc2ff6cb.png)
![image](https://user-images.githubusercontent.com/17680514/129417942-5a8d3c29-20bc-4325-879a-d66354f11b34.png)


# How to use

## Install the Report server
> TODO. For now you will need to build it yourself from the source

## Install the JUnit 5 report extension
> TODO. For now you will need to build it yourself from the source

## Setup the JUnit extension & execution configurations

In order to be able to report from JUnit to the server, you need to use the `ExecutionsViewerExtension` JUnit extension class.
Add the following annotation above the test class

```java
@ExtendWith(ExecutionsViewerExtension.class)
...
public class MyFakeBlogWebAppTests {
```

Next, define the environment variable that will hold the build version.
This is used to separate the execution reports by build versions later.
![image](https://user-images.githubusercontent.com/17680514/129592820-4729f3f2-2550-4513-a2d7-17c81253db08.png)


Add `@TestWithVersionEnv("TARGET_BUILD_VERSION")` annotation above the tests class. `TARGET_BUILD_VERSION` can be any name.
In this case, `TARGET_BUILD_VERSION` will be the name of the environment variable that holds the version under test.
For example, the `TARGET_BUILD_VERSION` value can be `v0.0.1`. When you have a new build, you should change this value to reflect the new version
so the new reports will be under the new version.


```java
@ExtendWith(ExecutionsViewerExtension.class)
@TestWithVersionEnv("TARGET_BUILD_VERSION")
...
public class MyFakeBlogWebAppTests {
```

If you use IntelliJ, you can configure the `TARGET_BUILD_VERSION` environment variable here:
![image](https://user-images.githubusercontent.com/17680514/129416298-f9148d8d-5b95-4413-b516-bc91a5b47b99.png)


Next, you must add `@Tag` to the test class & tests.
The tag is mapped to the feature that shown here:
![image](https://user-images.githubusercontent.com/17680514/129593730-0148b13d-f1a7-4a17-9226-e24fb4e1458a.png)


You will also be able to select only executions that are related to the `@Tag`/Feature
![image](https://user-images.githubusercontent.com/17680514/129593327-0eca97bd-bfd0-4c91-bcd3-c863a7755e88.png)


To add @Tag, you need to add under each test `@Tag` annotation with feature name inside.
For example:
![image](https://user-images.githubusercontent.com/17680514/129593826-424f6b46-9441-4db7-bf82-09393afe07ca.png)


Next, It is highly recommended to add `@DisplayName` annotation to the class and tests.
The value in the `@DisplayName` is a simplified name that is easier to read.
The `@DisplayName` is reflected here:
![image](https://user-images.githubusercontent.com/17680514/129593909-7dc9faef-6ad3-4536-8ea7-c30a84bcd5be.png)
![image](https://user-images.githubusercontent.com/17680514/129593983-25ff0500-f5de-4839-89d9-e3be4cc404c7.png)


### Full example of test class

#### @TestFactory Example
```java
package tests;

import executionmatrix.junit5.extension.ExecutionsViewerExtension;
import executionmatrix.junit5.extension.annotations.TestWithVersionEnv;
import app.MyFakeBlogWebApp;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;


import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.DynamicContainer.dynamicContainer;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

@ExtendWith(ExecutionsViewerExtension.class)
@TestWithVersionEnv("TARGET_BUILD_VERSION")
@DisplayName("Sanity Tests")
@Tag("BasicUserFunctionality")
public class DynamicTestsExample {

    @TestFactory
    @DisplayName("Login Tests")
    @Tag("Account")
    Stream<DynamicNode> loginTests() {
        return Stream.of(
                dynamicTest("Login with valid username", () -> {
                    System.out.println("Testing login with valid username ...");
                    MyFakeBlogWebApp app = new MyFakeBlogWebApp();
                    app.login("user1","1234");
                    assertTrue(app.isLoggedIn(),"Failed to log in");
                }),
                dynamicContainer("Failure login tests", Stream.of(
                        dynamicTest("Login with invalid password", () -> {
                            System.out.println("Testing login with invalid password ...");
                            MyFakeBlogWebApp app = new MyFakeBlogWebApp();
                            app.login("invalidUser","invalidPassword");
                            assertFalse(app.isLoggedIn(),"Expected the login to fail but succeed instead");
                        }),
                        dynamicTest("Block login attempts after 10 failed logins", () -> {
                            System.out.println("Testing block login attempts after 10 failed logins ...");
                            MyFakeBlogWebApp app = new MyFakeBlogWebApp();
                            for (int attempt = 1; attempt <= 10; attempt++)
                                app.login("invalidUser","invalidPassword");

                            assertThrows(RuntimeException.class,() -> app.login("invalidUser",
                                    "invalidPassword"),"The app did not blocked attempt number 11 to login");

                        })
                ))
        );
    }


    @TestFactory
    @DisplayName("Register Tests")
    @Tag("Account")
    Stream<DynamicNode> registerTests() {
        return Stream.of(
                dynamicTest("Register with valid username & password", () -> {
                    System.out.println("Testing register with valid username & password ...");
                    MyFakeBlogWebApp app = new MyFakeBlogWebApp();
                    app.register("user2","1234");
                    app.login("user2","1234");
                    assertTrue(app.isLoggedIn(),"Register failed (Failed to log in)");
                }),
                dynamicContainer("Failure register tests", Stream.of(
                        dynamicContainer("Field validation tests", Stream.of(
                                dynamicTest("Register with empty username field", () -> {
                                    System.out.println("Testing register with empty username field ...");
                                    MyFakeBlogWebApp app = new MyFakeBlogWebApp();
                                    assertThrows(RuntimeException.class, () -> app.register("","1234"),
                                            "Expected to fail register due to empty username field");
                                }),
                                dynamicTest("Register with empty password field", () -> {
                                    System.out.println("Testing register with empty password field ...");
                                    MyFakeBlogWebApp app = new MyFakeBlogWebApp();
                                    assertThrows(RuntimeException.class, () -> app.register("user2",""),
                                            "Expected to fail register due to empty password field");
                                })
                        )),
                        dynamicTest("Block register attempts after 10 failed attempts", () -> {
                            System.out.println("Testing block register attempts after 10 failed attempts ...");
                            MyFakeBlogWebApp app = new MyFakeBlogWebApp();
                            for (int attempt = 1; attempt <= 10; attempt++) {
                                try {
                                    app.register("","invalidPassword");
                                } catch (RuntimeException ignored) {}
                            }

                            assertThrows(RuntimeException.class,() -> app.register("",
                                    "invalidPassword"),"The app did not blocked attempt number 11 to login");

                        })
                ))
        );
    }

    @TestFactory
    @Tag("BlogsFunctionality")
    @DisplayName("Post Blogs Tests")
    Stream<DynamicNode> testBlogsFunctionality() {
        MyFakeBlogWebApp app = new MyFakeBlogWebApp();
        app.login("user1","1234");
        assertTrue(app.isLoggedIn(),"Precondition Failed: Failed to login");
        return Stream.of(
                dynamicTest("Post a valid blog post", () -> {
                    System.out.println("Testing post a valid blog post ...");
                    app.postBlog("Blog Title 1","Blog Content 1");
                    String lastBlogTitle = app.getLastBlogPostTitle();
                    assertEquals("Blog Title 1",lastBlogTitle,"Posting the blog failed because the blog title was wrong");
                }),
                dynamicContainer("Failure blog post tests", Stream.of(
                        dynamicContainer("Field validation tests", Stream.of(
                                dynamicTest("Post blog with empty title field", () -> {
                                    System.out.println("Testing post blog with empty title field ...");
                                    assertThrows(RuntimeException.class, () -> app.postBlog("","blogContent"),
                                            "Expected to fail posting blog due to empty blogTitle field");
                                }),
                                dynamicTest("Post blog with empty content field", () -> {
                                    System.out.println("Testing post blog with empty content field ...");
                                    assertThrows(RuntimeException.class, () -> app.postBlog("blogTitle1",""),
                                            "Expected to fail posting blog due to empty blogContent field");
                                })
                        ))
                ))
        );
    }

}


```

#### Basic Examples

```java
package tests;

import app.MyFakeBlogWebApp;
import executionmatrix.junit5.extension.ExecutionsViewerExtension;
import executionmatrix.junit5.extension.annotations.TestWithVersionEnv;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(ExecutionsViewerExtension.class)
@DisplayName("Basic Tests Example")
@Tag("Account")
@TestWithVersionEnv("TARGET_BUILD_VERSION")
public class BasicTestsExample {

    private MyFakeBlogWebApp app;

    @BeforeEach
    public void beforeEach() {
        app = new MyFakeBlogWebApp();
    }

    @Test
    @DisplayName("Test valid login")
    @Tag("Login")
    public void testValidLogin() {
        System.out.println("Testing a valid login scenario ...");
        app.login("user1","1234");
        assertTrue(app.isLoggedIn(),"Failed to log in");
    }

    @Test
    @DisplayName("Test login with wrong password")
    @Tag("Login")
    public void testLoginWithWrongPassword() {
        System.out.println("Testing login with wrong password scenario ...");
        app.login("user1","wrongPassword");
        assertFalse(app.isLoggedIn(),"Expected the login to fail but it passed instead");
    }

    @Test
    @DisplayName("Test multiple failed login attempts")
    @Tag("Login")
    public void testMultipleFailedLoginAttempts() {
        System.out.println("Testing multiple failed login attempts ...");
        for (int attempt = 1; attempt <= 10; attempt++)
            app.login("invalidUser","invalidPassword");

        assertThrows(RuntimeException.class,() -> app.login("invalidUser",
                "invalidPassword"),"The app did not blocked attempt number 11 to login");
    }

    @Test
    @DisplayName("Test register new user")
    @Tag("Register")
    public void testRegisterNewUser() {
        System.out.println("Testing register new user ...");
        app.register("newUser","1234");
        app.login("newUser","1234");
        assertTrue(app.isLoggedIn(),"Can't validate the register flow. " +
                "Failed to login to the registered account");
    }

    @Test
    @DisplayName("Test register existing user")
    @Tag("Register")
    public void testRegisterExistingUser() {
        System.out.println("Testing register existing user ...");
        app.register("newUser","1234");
        app.login("newUser","1234");
        assertTrue(app.isLoggedIn(),"Can't validate the register flow. " +
                "Failed to login to the registered account");
        app.logOut();
        assertFalse(app.isLoggedIn(),"Failed to log out after first register attempt");

        assertThrows(RuntimeException.class, () -> app.register("newUser","12345"),
                "Expected the register to failed after second attempt to register the same " +
                        "account. But instead the account is registered again");

    }

}

```


####
Dummy App 

```java
package app;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class MyFakeBlogWebApp {


    static class User {
        private final String username;
        private final String password;
        public User(String username, String password) {
            this.username = username;
            this.password = password;
        }
    }

    static class Blog {
        private final String blogTitle;
        private final String blogContent;

        public Blog(String blogTitle, String blogContent) {
            this.blogTitle = blogTitle;
            this.blogContent = blogContent;
        }
    }

    private static final int MAX_LOGIN_ATTEMPTS = 10;
    private List<User> users = new ArrayList<>();
    private List<Blog> blogs = new ArrayList<>();
    private User currentUser = null;
    private int loginAttempts = 0;
    private int registerAttempts = 0;

    public MyFakeBlogWebApp() {
        users.add(new User("user1", "1234"));
    }


    public void login(String username, String password) {

        if (loginAttempts >= MAX_LOGIN_ATTEMPTS)
            throw new RuntimeException("Maximum login attempts limit reached!");
        for (User user : users) {
            if (username.equals(user.username) && password.equals(user.password)) {
                currentUser = user;
                loginAttempts = 0;
                return;
            }
        }

        loginAttempts++;
    }

    public boolean isLoggedIn() {
        return currentUser != null;
    }

    public void logOut() {
        currentUser = null;
    }

    public void register(String username, String password) {

        registerAttempts++;

        if (username.isBlank())
            throw new RuntimeException("The username field can't be empty");

        if (password.isBlank())
            throw new RuntimeException("The password field can't be empty");

        for (User user : users) {
            if (user.username.equals(username))
                throw new RuntimeException("Username already exists!");
        }
        users.add(new User(username, password));

        registerAttempts = 0;
    }



    public void postBlog(String blogTitle, String blogContent) {
        if (blogTitle.isBlank())
            throw new RuntimeException("Invalid blog title provided");

        if (blogContent.isBlank())
            throw new RuntimeException("Invalid blog content provided");

//        blogs.add(new Blog(blogTitle,blogContent));

    }

    public String getLastBlogPostTitle() {
        if (blogs.size() == 0)
            throw new RuntimeException("No blogs found");

        return blogs.get(blogs.size()-1).blogTitle;
    }


}

```

#### Basic Example that shows the results kinds

```java
package tests;

import executionmatrix.junit5.extension.ExecutionsViewerExtension;
import executionmatrix.junit5.extension.annotations.TestWithVersionEnv;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.fail;

@ExtendWith(ExecutionsViewerExtension.class)
@DisplayName("Result Kinds Example")
@Tag("BasicFeature")
@TestWithVersionEnv("TARGET_BUILD_VERSION")
public class ResultKindsExample {

    @Test
    @DisplayName("Passed Test")
    public void passedTest() {
        System.out.println("A passed Test");
    }

    @Test
    @DisplayName("Failed Test")
    public void failedTest() {
        fail("A failed Test");
    }

    @Test
    @DisplayName("Fatal-Failed Test")
    public void fatalFailedTest() throws Exception {
        throw new Exception("A fatal failed test");
    }

    @Test
    @DisplayName("Disabled Test")
    @Disabled
    public void disabledTest() {
        System.out.println("A disabled test");
    }

}

```

This will render into:
![image](https://user-images.githubusercontent.com/17680514/129593437-5ca97a2d-f894-4ab3-913c-73e643673327.png)



# Contribution Guidelines

Please ensure your pull request adheres to the following guidelines:

- Alphabetize your entry.
- Search previous suggestions before making a new one, as yours may be a duplicate.
- Suggested READMEs should be beautiful or stand out in some way.
- Make an individual pull request for each suggestion.
- New categories, or improvements to the existing categorization are welcome.
- Keep descriptions short and simple, but descriptive.
- Start the description with a capital and end with a full stop/period.
- Check your spelling and grammar.
- Make sure your text editor is set to remove trailing whitespace.
- Use the `#readme` anchor for GitHub READMEs to link them directly

Thank you for your suggestions!
