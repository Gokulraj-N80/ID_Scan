import Employee from '../models/Employee.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get employee by ID (Admin view)
// @route   GET /api/employees/:id
// @access  Private/Admin
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify employee (Public QR scan view)
// @route   GET /api/employees/verify/:employeeId
// @access  Public
export const verifyEmployee = async (req, res) => {
  try {
    // Find by the custom employeeId, e.g. EMP001
    const employee = await Employee.findOne({ employeeId: req.params.employeeId }).select('-password');
    
    if (employee) {
      res.json({
        name: employee.name,
        employeeId: employee.employeeId,
        designation: employee.designation,
        department: employee.department,
        email: employee.email,
        phone: employee.phone,
        joiningDate: employee.joiningDate,
        status: employee.status,
        bloodGroup: employee.bloodGroup,
        profilePhoto: employee.profilePhoto
      });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, designation, dateOfBirth, joiningDate, address, emergencyContact, bloodGroup, profilePhoto } = req.body;

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    // Generate unique employee ID (e.g. EMP001)
    const count = await Employee.countDocuments();
    const employeeId = `EMP${(count + 1).toString().padStart(3, '0')}`;
    
    // Default password for new employees (can be changed later)
    const password = 'Password@123';

    const employee = await Employee.create({
      employeeId,
      name,
      email,
      password,
      phone,
      department,
      designation,
      dateOfBirth,
      joiningDate,
      address,
      emergencyContact,
      bloodGroup,
      profilePhoto
    });

    // Log activity
    await ActivityLog.create({
      action: 'Created Employee',
      performedBy: `Admin: ${req.user.name}`,
      employeeId: employee._id,
      description: `Created new employee ${name} (${employeeId})`
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.name = req.body.name || employee.name;
      employee.phone = req.body.phone || employee.phone;
      employee.department = req.body.department || employee.department;
      employee.designation = req.body.designation || employee.designation;
      employee.address = req.body.address || employee.address;
      employee.bloodGroup = req.body.bloodGroup || employee.bloodGroup;
      
      const updatedEmployee = await employee.save();

      // Log activity
      await ActivityLog.create({
        action: 'Updated Employee',
        performedBy: `Admin: ${req.user.name}`,
        employeeId: employee._id,
        description: `Updated details for ${employee.name}`
      });

      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update employee status
// @route   PATCH /api/employees/:id/status
// @access  Private/Admin
export const updateEmployeeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.status = status;
      const updatedEmployee = await employee.save();

      // Log activity
      await ActivityLog.create({
        action: `${status === 'Active' ? 'Activated' : 'Deactivated'} Employee`,
        performedBy: `Admin: ${req.user.name}`,
        employeeId: employee._id,
        description: `Changed status of ${employee.name} to ${status}`
      });

      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
