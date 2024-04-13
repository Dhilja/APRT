drop table if exists apad_assembly_area;
create table apad_assembly_area (
	area_number varchar(20) primary key,
    plant_number integer,
    length numeric(10,1),
    breadth numeric(10,1),
    rows integer,
    columns integer,
    pad_length numeric(10,1),
    pad_breadth numeric(10,1),
    occupied_area numeric(10,1) DEFAULT 0.0,
    total_area numeric(10,1) GENERATED ALWAYS AS ((length * breadth)) STORED,
    available_area numeric(10,1) GENERATED ALWAYS AS (((length * breadth) - occupied_area)) STORED,
	status varchar(20) not null,
    
	time timestamptz default current_timestamp
);

drop table if exists apad_product;

create table apad_product(
	drawing_number varchar(20) primary key,
	module_name  varchar(20),
	length int,
	breadth int,
	height int,
	customer_name varchar(30),
	oa_number varchar(20),
	inspection_date DATE,
	time timestamptz default current_timestamp
	
	
);


-- Drop the table if it exists
DROP TABLE IF EXISTS apad_slicedparts;

-- Create the table
-- Drop the table if it exists
DROP TABLE IF EXISTS apad_slicedparts;
drop SEQUENCE if exists apad_slicedparts_id_seq;
-- Create the table
CREATE TABLE apad_slicedparts (
   id  serial PRIMARY KEY,
	slice_name varchar(20) unique,
    length INT,
    breadth INT,
    height INT,
    additional_length INT,
    additional_breadth INT,
	foot_length int generated always as (length+additional_length) stored,
	foot_breadth int generated always as (breadth+additional_breadth) stored,
    walkaround_distance INT,
    footprint_area DECIMAL(10, 1) GENERATED ALWAYS AS ((length+additional_length)*(breadth+additional_breadth)) stored,
    occ_length INT GENERATED ALWAYS AS (length + additional_length+ walkaround_distance) stored,
    occ_breadth INT GENERATED ALWAYS AS (breadth +additional_breadth+ walkaround_distance) stored,
    occupied_area DECIMAL(10, 1) GENERATED ALWAYS AS (
        (length +additional_length+ walkaround_distance) * (breadth + additional_breadth+walkaround_distance)
    ) stored,
	time timestamptz default current_timestamp,
	start_date date,
	end_date date,
	no_of_blocks int,
    drawing_number VARCHAR(20) REFERENCES apad_product(drawing_number)
	
);

drop table if exists apad_sliceposition;
create table apad_sliceposition(
	id int primary key references apad_slicedparts(id),
	x int,
	y int,
	area_number varchar(20) references apad_assembly_area(area_number),
	user_name varchar(20),
	time timestamptz default current_timestamp,
	color varchar(255),
	drawing_number varchar(20) references apad_product(drawing_number)
	
)



-- Create a trigger function
CREATE OR REPLACE FUNCTION apad_update_occupied_area()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate the new occupied_area for the specific area_number
    UPDATE apad_assembly_area AS aa
    SET occupied_area = (
        SELECT ROUND(SUM(sparts.occupied_area / 1000000), 2) AS occupied_area
        FROM apad_sliceposition AS sp
        JOIN apad_slicedparts AS sparts ON sp.id = sparts.id
        WHERE 
            sp.area_number = NEW.area_number -- Match the area_number from the new/updated apad_sliceposition
            AND sparts.start_date <= CURRENT_DATE -- Check if the current date is after or equal to the slice start_date
            AND sparts.end_date >= DATE_TRUNC('MONTH', CURRENT_DATE) -- Check if the start of the current month is before or equal to the slice end_date
    )
    WHERE aa.area_number = NEW.area_number; -- Assuming NEW.area_number is the area_number in the newly inserted or updated apad_sliceposition record;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Create a trigger to automatically update apad_assembly_area
CREATE TRIGGER apad_update_occupied_area_trigger
AFTER INSERT OR UPDATE OR DELETE ON apad_sliceposition
FOR EACH ROW
EXECUTE FUNCTION apad_update_occupied_area();
