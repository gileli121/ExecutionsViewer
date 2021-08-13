﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ExecutionMatrix.App.Database.Tables;

namespace ExecutionMatrix.App.Controllers.DTOs
{
    public class TestWithExecutionsDTO
    {

        public int TestId { get; set; }

        public string TestMethodName { get; set; }

        public string TestDisplayName { get; set; }

        public TestClassDTO TestClass { get; set; } 

        public List<FeatureInTestDTO> Features { get; set; }

        public List<ExecutionInTestDTO> Executions { get; set; }


        public TestWithExecutionsDTO() {}

        public TestWithExecutionsDTO(Test test, List<Execution> executions)
        {
            this.TestId = test.Id;
            this.TestMethodName = test.TestMethodName;
            this.TestDisplayName = test.TestDisplayName;
            if (test.TestClass != null)
                this.TestClass = new TestClassDTO(test.TestClass);

            this.Features = new List<FeatureInTestDTO>();
            foreach (var testFeature in test.Features)
                this.Features.Add(new FeatureInTestDTO(testFeature));

            this.Executions = new List<ExecutionInTestDTO>();
            foreach (var execution in executions)
                this.Executions.Add(new ExecutionInTestDTO(execution));
        }

    }
}