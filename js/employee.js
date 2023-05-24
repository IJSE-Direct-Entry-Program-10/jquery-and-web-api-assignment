const employeeList = [];

class Employee {
    id;
    name;
    address;
    contact;
    dob;
    salary;

    constructor(name, address, contact, dob, salary){
        this.id = !employeeList.length ? 1 : employeeList[employeeList.length - 1].id + 1;
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.dob = dob;
        this.salary = salary;
    }

    getEmployeeId(){
        return `E${this.id.toString().padStart(3, 0)}`;
    }

    delete() {
        employeeList.splice(employeeList.indexOf(this), 1);
    }

    generateHtml() {
        return `
            <tr>
            <td>${this.getEmployeeId()}</td>
            <td>${this.name}</td>
            <td>${this.address}</td>
            <td>
                <span class="material-symbols-outlined">
                    delete_forever
                </span>
            </td>
            </tr>
        `;
    }
}

export {employeeList, Employee};