import GenericList from '../components/generic-list';
import React, { useContext, useEffect, useState } from 'react';
import { LogParserResponse } from '@log-parser/common';
import { deleteData, getData } from '../services/api.service';
import { NavLink } from 'react-router-dom';
import UploadFile from '../components/upload-file';
import { LoadingContext } from '../context/loading.context';
import moment from 'moment';
import { environment } from '../../environments/environment';
import Spinner from '../components/spinner';
import { ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatBytes } from '../utils/utils';

const DATE_FORMAT = environment.DATE_FORMAT;

export function LogsView() {
  const { isLoading, showLoading, hideLoading } = useContext(LoadingContext);
  const [data, setData] = useState<LogParserResponse[]>([]);
  const [updated, setUpdated] = useState<LogParserResponse>();
  const [deleted, setDeleted] = useState<string>();

  const fetchLogs = async () => {
    try {
      showLoading();
      const result: LogParserResponse[] = await getData<LogParserResponse>(
        `/logs`
      );
      setData(result);
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error(error);
    }
  };

  const removeLog = async (correlation: string) => {
    try {
      showLoading();
      const result: number = await deleteData(`/log/${correlation}`);
      if (result === 204) {
        setDeleted(new Date().toISOString());
      }
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error(error);
    }
  };

  const handleFileUploaded = (file: LogParserResponse): void => {
    setUpdated(file);
  };

  const handleDeleteFile = async (correlation: string): Promise<void> => {
    await removeLog(correlation);
  };

  useEffect((): void => {
    fetchLogs();
  }, [updated, deleted]);

  return (
    <>
      <UploadFile onUploaded={handleFileUploaded} />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-flow-row auto-rows-max bg-white border-slate-200 divide-y p-3 divide-slate-200 rounded-md border">
          <GenericList<LogParserResponse>
            data={data}
            className="p-2 hover:bg-slate-100"
            keyExtractor={(item) => item.id}
            renderItem={(item) => (
              <>
                <NavLink to={`/logs/log/${item.correlation}`} state={item}>
                  <ChevronRightIcon className="inline-block h-3 w-3 mr-2" />
                  <div className="inline-block min-w-[8rem]">{item.name}</div>
                  <div className="inline-block mr-5 rounded-full bg-sky-200 p-1 text-sm text-slate-600">
                    {formatBytes(item.size)}
                  </div>
                  <div className="inline-block text-sm">
                    {moment(item.createdAt).format(DATE_FORMAT)}
                  </div>
                </NavLink>
                <TrashIcon
                  title="Delete log"
                  onClick={() => handleDeleteFile(item.correlation)}
                  className="inline-block cursor-pointer h-5 w-5 ml-2"
                />
              </>
            )}
          />
        </div>
      )}
    </>
  );
}

export default LogsView;
