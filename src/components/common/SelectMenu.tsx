import * as React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import Checkbox from '@mui/joy/Checkbox';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface iSelectMenuProps {
    categories: Category[];
    onCategoryChange: (categoryId: number) => void; 
}

const SelectMenu = (props: iSelectMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    
    const [checkedState, setCheckedState] = React.useState(
        props.categories.map(category => category.checked || false)
    );

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggle = (index: number) => {
        const newCheckedState = [...checkedState];
        newCheckedState[index] = !newCheckedState[index];
        setCheckedState(newCheckedState);
    };

    return (
        <div>
            <Button
                aria-label="categories"
                id="category-button"
                aria-controls={anchorEl ? 'category-menu' : undefined}
                aria-expanded={anchorEl ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                style={{
                    backgroundColor: 'blue', 
                    color: 'white',           
                    borderRadius: '4px',      
                    padding: '8px 16px',    
                }}
            >
                Categories
                <ArrowDropDownIcon />
            </Button>
            <Menu
                id="category-menu"
                MenuListProps={{
                    'aria-labelledby': 'category-button',
                }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '32ch',
                    },
                }}
            >
                {props.categories.map((category, index) => (
                    <MenuItem key={category.categoryId} onClick={() => {handleToggle(index); props.onCategoryChange(props.categories[index].categoryId) }} >
                        <Checkbox label={category.name} checked={checkedState[index]} />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export default SelectMenu;