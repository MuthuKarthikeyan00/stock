import { Employee as EmployeeModel } from "@src/models/Employee";
import { Request, Response } from "express";

export default class Employee {
    public static async render(req: Request, res: Response) {
        return res.status(200).render('employee', {});
    }

    public static async create(req: Request, res: Response) {
        try {
            // Extract data from the form (req.body)
            const { firstName, lastName, email, phone, role_id } = req.body;
      
            // // Validate the data (you can add more validations as needed)
            // if (!firstName || !lastName || !email || !phone || !role_id) {
            //   return res.status(400).send('All fields are required');
            // }
      
            // Create a new employee record in the database
            const newEmployee = await EmployeeModel.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                role_id: 1,  // You can adjust the role_id as per your requirements
            });
      
            // Respond with a success message and the created employee data
            return res.status(201).json({
              message: 'Employee created successfully',
              employee: newEmployee
            });
          } catch (error) {
            console.error('Error creating employee:', error);
            return res.status(500).send('An error occurred while creating the employee');
          }
        
    }
}
