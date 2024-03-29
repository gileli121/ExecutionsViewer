package tests;

import executionmatrix.junit5.extension.ExecutionsViewerExtension;
import executionmatrix.junit5.extension.annotations.TestWithVersion;
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
@TestWithVersion("v1")
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
