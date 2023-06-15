import GenericList from '../components/generic-list';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { LogParserEntryResponse } from '@log-parser/common';
import { FiltersState } from '../types';
import { getData } from '../services/api.service';
import { Link, useLocation, useParams } from 'react-router-dom';
import NoMatch from '../components/no-match';
import Filters, { FormProps } from '../components/filters';
import { LoadingContext } from '../context/loading.context';
import moment from 'moment/moment';
import { environment } from '../../environments/environment';
import { debounce } from 'lodash';
import Spinner from '../components/spinner';
import { formatBytes } from '../utils/utils';

const DATE_FORMAT = environment.DATE_FORMAT;

export function LogView() {
  const initialFilter = {} as FiltersState;
  const [filters, setFilters] = useState<FiltersState>(initialFilter);
  const [data, setData] = useState<LogParserEntryResponse[]>([]);
  const { id } = useParams<'id'>();
  const { isLoading, showLoading, hideLoading } = useContext(LoadingContext);
  const { state } = useLocation();

  const handleFiltersChanged = (filters: FormProps): void => {
    setFilters(filters);
  };

  const fetchLog = async () => {
    try {
      showLoading();
      const { level, timestamp, content } = filters;
      const result: LogParserEntryResponse[] =
        await getData<LogParserEntryResponse>(`/log/${id}`, {
          ...(level && { level }),
          ...(timestamp && { timestamp }),
          ...(content && { content }),
        });
      setData(result);
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error(error);
    }
  };

  const debounceFetchData = useCallback(debounce(fetchLog, 200), [fetchLog]);

  useEffect(() => {
    debounceFetchData();
  }, [filters]);

  if (!id) {
    return <NoMatch />;
  }

  return (
    <>
      <div className="mt-5">
        <Link
          className="mt-5 mb-5 bg-sky-500 hover:bg-sky-400 text-white text-sm leading-6 py-2 px-3 rounded-lg"
          to={'/logs'}
        >
          Back to logs
        </Link>
        <div className="mt-5 mb-5">
          <Filters onChanged={handleFiltersChanged} />
        </div>
        <div className="grid grid-flow-row auto-rows-max bg-white border-slate-200 divide-y divide-slate-200 p-2 mt-5 rounded-md border">
          <div className="mb-1 pt-1">name: {state?.name}</div>
          <div className="mb-1 pt-1">size: {formatBytes(state?.size)}</div>
          <div className="mb-1 pt-1">mimetype: {state?.mimetype}</div>
          <div className="mb-1 pt-1">file name: {state?.originalName}</div>
          <div className="mb-1 pt-1">
            created at: {moment(state?.createdAt).format(DATE_FORMAT)}
          </div>
        </div>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="bg-white mt-5 mb-5 p-2 overflow-x-auto rounded-md border">
          <GenericList<LogParserEntryResponse>
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={(item) => (
              <div className="grid grid-flow-col auto-cols-max gap-3">
                <div>{item.timestamp}</div>
                <div className="min-w-[3rem]">{item.level}</div>
                <div>{item.content}</div>
              </div>
            )}
          />
        </div>
      )}
    </>
  );
}

export default LogView;
