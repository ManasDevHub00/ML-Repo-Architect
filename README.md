# javapractice

This repository contains a collection of Java practice programs, demonstrating various concepts, algorithms, and data structures. It serves as a personal sandbox for learning and experimenting with Java.

## Structural Overview

The project is organized as follows:

```
javapractice/
└── Javalab/
    ├── A.class
    ├── A1.class
    ├── A2.class
    ├── A3.class
    ├── Abc.class
    ├── Abc1.class
    ├── Abc2.class
    ├── B.class
    ├── C.class
    ├── Calc.class
    ├── Calc2.class
    ├── Calcs.class
    ├── Calcs1.class
    ├── Circle.class
    ├── MyThread2.class
    ├── MyThread2.java
    ├── MyThread29.class
    ├── MyThread29.java
    ├── Mythread.class
    ├── Mythread.java
    ├── Mythread1.class
    ├── Mythread1.java
    ├── NThread.class
    ├── Parctical6.java
    ├── Practical1.class
    ├── Practical1.java
    ├── Practical10a.class
    ├── Practical10a.java
    ├── Practical10b.class
    ├── Practical10b.java
    ├── Practical11.java
    ├── Practical12.class
    ├── Practical12.java
    ├── Practical13.class
    ├── Practical13.java
    ├── Practical14.class
    ├── Practical14.java
    ├── Practical15.class
    ├── Practical15.java
    ├── Practical16.class
    ├── Practical16.java
    ├── Practical19.class
    ├── Practical19.java
    ├── Practical2.java
    ├── Practical20.class
    ├── Practical20.java
    ├── Practical2122.class
    ├── Practical2122.java
    ├── Practical23.class
    ├── Practical23.java
    ├── Practical24.class
    ├── Practical24.java
    ├── Practical25.class
    ├── Practical25.java
    ├── Practical3.java
    ├── Practical4.java
    ├── Practical5.java
    ├── Practical7.class
    ├── Practical7.java
    ├── Practical8.class
    ├── Practical8.java
    ├── Practical9.class
    ├── Practical9.java
    ├── Rectangle.class
    ├── Shape.class
    ├── Student.class
    ├── TestArea.class
    ├── TestArea.java
    ├── TestShape.class
    ├── TestShape.java
    ├── Throws.class
    ├── Throws.java
    ├── Triangle.class
    ├── f1.class
    ├── mypack/
    │   ├── ABC.class
    │   ├── ABC.java
    │   ├── ABC1.class
    │   ├── ABC1.java
    │   ├── ABC2.class
    │   └── ABC2.java
    ├── mypack1/
    │   ├── ABC3.class
    │   ├── ABC3.java
    │   ├── ABC4.class
    │   └── ABC4.java
    └── pack2/
        ├── Calc.class
        └── Calc.java
```

## Setup Instructions

To set up and run the Java programs in this repository, follow these steps:

### Prerequisites

*   **Java Development Kit (JDK)**: Ensure you have a JDK installed (e.g., OpenJDK 8 or newer). You can download it from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use a package manager.

### Clone the Repository

First, clone the repository to your local machine using Git:

```bash
git clone https://github.com/ManasDevHub00/javapractice.git
cd javapractice
```

### Compile and Run Java Files

Navigate into the `Javalab` directory (or specific subdirectories for packaged classes) to compile and run the `.java` files.

**Example: Compiling and Running a Simple Java File**

Let's assume you want to run `Javalab/Practical1.java`.

1.  **Navigate to the `Javalab` directory**:
    ```bash
    cd Javalab
    ```

2.  **Compile the Java file**:
    ```bash
    javac Practical1.java
    ```
    This command will compile `Practical1.java` and generate `Practical1.class` in the same directory.

3.  **Run the compiled Java class**:
    ```bash
    java Practical1
    ```
    The output of the program will be displayed in your console.

**Example: Compiling and Running a Java File with Packages**

For files within packages, like `Javalab/mypack/ABC.java`:

1.  **Navigate to the parent directory of the package**:
    ```bash
    cd Javalab
    ```

2.  **Compile the Java file, specifying the source path**:
    ```bash
    javac mypack/ABC.java
    ```
    This will compile `ABC.java` and place `ABC.class` inside the `mypack` directory.

3.  **Run the compiled Java class, using its fully qualified name**:
    ```bash
    java mypack.ABC
    ```

## Usage Examples

Each Java file in the `Javalab` directory (and its subdirectories) typically represents a standalone program or a set of related classes. To understand their specific functionality, you would typically examine the source code of each `.java` file.

Follow the "Compile and Run Java Files" instructions above for any specific `.java` file you wish to execute.

## Big-O Complexity Analysis

Big-O complexity analysis was not performed for this repository because no local code files were provided for analysis. To get Big-O complexity for specific algorithms, please upload the `.java` files for analysis.
