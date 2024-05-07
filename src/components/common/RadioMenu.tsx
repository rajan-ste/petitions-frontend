import * as React from 'react';
import { Button, Menu, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Option {
    label: string;
    code: string;
}

interface IRadioMenuProps {
    options: Option[];
    title: string;
    onInputChangeStr: (value: string) => void;
}

const RadioMenu = (props: IRadioMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedVal, setSelectedVal] = React.useState<string>(props.options[0].code);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setSelectedVal(newVal);
        props.onInputChangeStr(newVal)
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
                        value={selectedVal}
                        name="price-range-group"
                        onChange={handleRadioChange}
                    >
                        {props.options.map((item) => (
                            <FormControlLabel key={item.code} value={item.code} control={<Radio />} label={item.label} />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Menu>
        </div>
    );
}

export default RadioMenu;
