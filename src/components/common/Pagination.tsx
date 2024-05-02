import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

interface iPaginationProps {
    itemsPerPage: number,
    count: number
    page: number
}

const PaginationButs = (props: iPaginationProps) => {
  return (
    <Pagination
      page={props.page}
      count={Math.ceil(props.count / props.itemsPerPage)}
      renderItem={(item) => (
        <PaginationItem
          component={Link}
          to={`/petitions${item.page === 1 ? '' : `?page=${item.page}`}`}
          {...item}
        />
      )}
    />
  );
}

export default PaginationButs;