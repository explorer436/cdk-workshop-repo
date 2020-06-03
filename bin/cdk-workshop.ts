#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { EmployeeCdkStack } from '../lib/employee-cdk-stack';

const app = new cdk.App();
new EmployeeCdkStack(app, 'EmployeeCdkStack');
