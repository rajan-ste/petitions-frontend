import * as React from 'react';
import { Button, Menu, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface IRadioMenuProps {
    options: string[],
    title: string
}

const RadioMenu = (props: IRadioMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedPrice, setSelectedPrice] = React.useState<string>(props.options[0]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPrice(event.target.value);
        handleClose();
    };

    return (
        <div>
            <Button
                aria-label="select-price"
                id="select-price-button"
                aria-controls={anchorEl ? 'select-price-menu' : undefined}
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
                {props.title}
                <ArrowDropDownIcon />
            </Button>
            <Menu
                id="select-price-menu"
                MenuListProps={{
                    'aria-labelledby': 'select-price-button',
                }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '32ch',
                        paddingLeft: '1vh'
                    },
                }}
            >
                <FormControl>
                    <RadioGroup
                        aria-labelledby="select-price-button"
                        value={selectedPrice}
                        name="price-range-group"
                        onChange={handleRadioChange}
                    >
                        {props.options.map((item) => (
                            <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Menu>
        </div>
    );
}

export default RadioMenu;
