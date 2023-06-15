import React from 'react';

interface ListProps<T> {
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  data: T[];
  className?: string;
}

function GenericList<T>({
  renderItem,
  keyExtractor,
  data,
  className,
}: ListProps<T>) {
  return (
    <>
      {data && data.length ? (
        <>
          {data.map((item: T) => (
            <div className={className} key={keyExtractor(item)}>
              {renderItem(item)}
            </div>
          ))}
        </>
      ) : (
        <p>No results</p>
      )}
    </>
  );
}

export default GenericList;
