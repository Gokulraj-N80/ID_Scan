import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Employee from './models/Employee.js';
import Task from './models/Task.js';
import ActivityLog from './models/ActivityLog.js';
import { connectDB } from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Admin.deleteMany();
    await Employee.deleteMany();
    await Task.deleteMany();
    await ActivityLog.deleteMany();

    const createdAdmin = await Admin.create({
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'password123',
    });

    const adminId = createdAdmin._id;

    const employees = [
      {
        employeeId: 'EMP001',
        name: 'Gokul',
        email: 'gokul@company.com',
        password: 'Password@123',
        phone: '9876543210',
        department: 'Engineering',
        designation: 'Senior Developer',
        joiningDate: new Date('2024-01-15'),
        status: 'Active',
        totalPoints: 740,
        bloodGroup: 'O+'
      },
      {
        employeeId: 'EMP002',
        name: 'Arun',
        email: 'arun@company.com',
        password: 'Password@123',
        phone: '9876543211',
        department: 'Design',
        designation: 'UI/UX Designer',
        joiningDate: new Date('2024-02-01'),
        status: 'Active',
        totalPoints: 920,
        bloodGroup: 'A+'
      },
      {
        employeeId: 'EMP003',
        name: 'Priya',
        email: 'priya@company.com',
        password: 'Password@123',
        phone: '9876543212',
        department: 'Marketing',
        designation: 'Marketing Manager',
        joiningDate: new Date('2023-11-10'),
        status: 'Active',
        totalPoints: 680,
        bloodGroup: 'B+'
      },
      {
        employeeId: 'EMP004',
        name: 'Karthik',
        email: 'karthik@company.com',
        password: 'Password@123',
        phone: '9876543213',
        department: 'HR',
        designation: 'HR Executive',
        joiningDate: new Date('2022-05-20'),
        status: 'Inactive',
        totalPoints: 590,
        bloodGroup: 'AB-'
      }
    ];

    const insertedEmployees = await Employee.insertMany(employees);

    const tasks = [
      {
        title: 'Develop Login API',
        description: 'Create the backend API for user login with JWT.',
        assignedTo: insertedEmployees[0]._id,
        points: 50,
        priority: 'High',
        dueDate: new Date('2026-09-05'),
        status: 'In Progress',
        createdBy: adminId
      },
      {
        title: 'Frontend Dashboard',
        description: 'Design and develop the React admin dashboard.',
        assignedTo: insertedEmployees[1]._id,
        points: 30,
        priority: 'Medium',
        dueDate: new Date('2026-09-10'),
        status: 'Pending',
        createdBy: adminId
      }
    ];

    await Task.insertMany(tasks);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroyData();
} else {
  importData();
}
