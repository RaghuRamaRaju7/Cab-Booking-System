import java.util.*;

class Cab {
    private int cabId;
    private String driverName;
    private boolean isAvailable;

    public Cab(int cabId, String driverName) {
        this.cabId = cabId;
        this.driverName = driverName;
        this.isAvailable = true;
    }

    public int getCabId() {
        return cabId;
    }

    public String getDriverName() {
        return driverName;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    @Override
    public String toString() {
        return "Cab{" +
                "ID=" + cabId +
                ", Driver='" + driverName + '\'' +
                ", Available=" + isAvailable +
                '}';
    }
}

class Customer {
    private int customerId;
    private String name;

    public Customer(int customerId, String name) {
        this.customerId = customerId;
        this.name = name;
    }

    public int getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }
}

class Booking extends Thread {
    private Cab cab;
    private Customer customer;

    public Booking(Cab cab, Customer customer) {
        this.cab = cab;
        this.customer = customer;
    }

    @Override
    public void run() {
        synchronized (cab) {
            if (cab.isAvailable()) {
                System.out.println("Booking confirmed! " + customer.getName() +
                        " got Cab ID: " + cab.getCabId() + " driven by " + cab.getDriverName());
                cab.setAvailable(false);
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                cab.setAvailable(true);
                System.out.println("Cab ID: " + cab.getCabId() + " is now available again.");
            } else {
                System.out.println("Sorry " + customer.getName() + ", Cab ID: " +
                        cab.getCabId() + " is already booked.");
            }
        }
    }
}

public class CabBookingSystem {
    static List<Cab> cabs = new ArrayList<>();
    static List<Customer> customers = new ArrayList<>();
    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {
        int choice;
        do {
            System.out.println("\n=== Multi-Threaded Cab Booking System ===");
            System.out.println("1. Add Cab");
            System.out.println("2. Add Customer");
            System.out.println("3. Book Cab");
            System.out.println("4. Show All Cabs");
            System.out.println("5. Exit");
            System.out.print("Enter choice: ");
            choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {
                case 1:
                    addCab();
                    break;
                case 2:
                    addCustomer();
                    break;
                case 3:
                    bookCab();
                    break;
                case 4:
                    showCabs();
                    break;
                case 5:
                    System.out.println("Exiting... Thank you!");
                    break;
                default:
                    System.out.println("Invalid choice!");
            }
        } while (choice != 5);
    }

    public static void addCab() {
        System.out.print("Enter Cab ID: ");
        int id = sc.nextInt();
        sc.nextLine();
        System.out.print("Enter Driver Name: ");
        String name = sc.nextLine();
        cabs.add(new Cab(id, name));
        System.out.println("Cab added successfully!");
    }

    public static void addCustomer() {
        System.out.print("Enter Customer ID: ");
        int id = sc.nextInt();
        sc.nextLine();
        System.out.print("Enter Customer Name: ");
        String name = sc.nextLine();
        customers.add(new Customer(id, name));
        System.out.println("Customer added successfully!");
    }

    public static void bookCab() {
        if (cabs.isEmpty() || customers.isEmpty()) {
            System.out.println("Please add cabs and customers first!");
            return;
        }

        System.out.print("Enter Customer ID: ");
        int customerId = sc.nextInt();
        Customer customer = findCustomerById(customerId);
        if (customer == null) {
            System.out.println("Customer not found!");
            return;
        }

        System.out.print("Enter Cab ID: ");
        int cabId = sc.nextInt();
        Cab cab = findCabById(cabId);
        if (cab == null) {
            System.out.println("Cab not found!");
            return;
        }

        Booking bookingThread = new Booking(cab, customer);
        bookingThread.start();
    }

    public static void showCabs() {
        if (cabs.isEmpty()) {
            System.out.println("No cabs available.");
        } else {
            for (Cab cab : cabs) {
                System.out.println(cab);
            }
        }
    }

    public static Customer findCustomerById(int id) {
        for (Customer c : customers) {
            if (c.getCustomerId() == id) return c;
        }
        return null;
    }

    public static Cab findCabById(int id) {
        for (Cab cab : cabs) {
            if (cab.getCabId() == id) return cab;
        }
        return null;
    }
}
