
-- #-1 Create the required tables for the retail store database based on the tables structure and relationships.
    CREATE TABLE Suppliers (
        SupplierID INT AUTO_INCREMENT PRIMARY KEY,
        SupplierName VARCHAR(255) NOT NULL,
        ContactNumber VARCHAR(55)
    );
    CREATE TABLE Products (
        ProductID INT AUTO_INCREMENT PRIMARY KEY,
        ProductName VARCHAR(255) NOT NULL,
        Price DECIMAL(10,2) NOT NULL,
        StockQuantity INT NOT NULL,
        SupplierID INT,
        CONSTRAINT fk_supplier
            FOREIGN KEY (SupplierID)
            REFERENCES Suppliers(SupplierID)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );
    CREATE TABLE Sales (
        SaleID INT AUTO_INCREMENT PRIMARY KEY,
        ProductID INT NOT NULL,
        QuantitySold INT NOT NULL,
        SaleDate DATE NOT NULL,
        CONSTRAINT fk_product
            FOREIGN KEY (ProductID)
            REFERENCES Products(ProductID)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );

-- #-2 Add a column “Category” to the Products table.
    ALTER TABLE Products
    ADD Category VARCHAR(255);

-- #-3 Remove the “Category” column from Products.
    ALTER TABLE Products
    DROP COLUMN Category;

-- #-4 Change “ContactNumber” column in Suppliers to VARCHAR (15).
    ALTER TABLE Suppliers
    MODIFY ContactNumber VARCHAR(15);

-- #-5 Add a NOT NULL constraint to ProductName.
    ALTER TABLE Products
    MODIFY ProductName VARCHAR(255) NOT NULL;

-- #-6 Perform Basic Inserts:
    -- a
        INSERT INTO Suppliers (SupplierName, ContactNumber)
        VALUES ('FreshFoods', '01001234567');
    -- b
        INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
        VALUES 
        ('Milk', 15.00, 50, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods')),
        ('Bread', 10.00, 30, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods')),
        ('Eggs', 20.00, 40, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods'));
    -- c
        INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
        VALUES (
            (SELECT ProductID FROM Products WHERE ProductName = 'Milk'),
            2,
            '2025-05-20'
        );
-- #-7 Update the price of 'Bread' to 25.00.
    UPDATE Products
    SET Price = 25.00
    WHERE ProductName = 'Bread';

-- #-8 Delete the product 'Eggs'.
    DELETE FROM Products
    WHERE ProductName = 'Eggs';

-- #-9 Retrieve the total quantity sold for each product.
    SELECT 
        p.ProductName,
        SUM(s.QuantitySold) AS TotalQuantitySold
    FROM 
        Products p
    LEFT JOIN 
        Sales s ON p.ProductID = s.ProductID
    GROUP BY 
        p.ProductName;

-- #-10-Get the product with the highest stock.
    SELECT 
    ProductID,
    ProductName,
    Price,
    StockQuantity,
    SupplierID
    FROM Products
    WHERE StockQuantity = (SELECT MAX(StockQuantity) FROM Products);

-- #-11-Find suppliers with names starting with 'F'.
    SELECT 
    SupplierID,
    SupplierName,
    ContactNumber
    FROM Suppliers
    WHERE SupplierName LIKE 'F%';

-- #-12-Show all products that have never been sold.
    SELECT 
    p.ProductID,
    p.ProductName,
    p.Price,
    p.StockQuantity
    FROM Products p
    LEFT JOIN Sales s ON p.ProductID = s.ProductID
    WHERE s.SaleID IS NULL;

-- #-13-Get all sales along with product name and sale date.
    SELECT 
    s.SaleID,
    p.ProductName,
    s.QuantitySold,
    s.SaleDate
    FROM Sales s
    INNER JOIN Products p ON s.ProductID = p.ProductID
    ORDER BY s.SaleDate DESC;

-- #-14-Create a user “store_manager” and give them SELECT, INSERT, and UPDATE permissions on all tables.
    CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'sm_1234';
    GRANT SELECT, INSERT, UPDATE ON retail_store.* TO 'store_manager'@'localhost';

-- #-15-Revoke UPDATE permission from “store_manager”.
    REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost';

-- #-16-Grant DELETE permission to “store_manager” only on the Sales table.
    GRANT DELETE ON retail_store.Sales TO 'store_manager'@'localhost';

