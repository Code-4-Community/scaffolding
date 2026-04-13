import { Table } from '@chakra-ui/react';
import type { ApplicationRow } from '@hooks/useApplications';

const COLUMNS = [
  'Name',
  'Proposed Date',
  'Actual Start Date',
  'Discipline',
  'Applicant Type',
  'Status',
];

interface ApplicationTableProps {
  applications: ApplicationRow[];
  searchQuery?: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dateStr;
  const [, year, month, day] = match;
  return `${month}/${day}/${year}`;
}

export function ApplicationTable({
  applications,
  searchQuery = '',
}: ApplicationTableProps) {
  const filteredApplications = applications.filter((application) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      application.name.toLowerCase().includes(query) ||
      application.discipline.toLowerCase().includes(query) ||
      application.status.toLowerCase().includes(query) ||
      application.email.toLowerCase().includes(query)
    );
  });

  return (
    <Table.Root striped stickyHeader minW="900px">
      <Table.Header>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.ColumnHeader
              key={column}
              backgroundColor="#013594"
              color="white"
            >
              {column}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filteredApplications.map((application) => (
          <Table.Row key={application.appId}>
            <Table.Cell>{application.name}</Table.Cell>
            <Table.Cell>{formatDate(application.proposedStartDate)}</Table.Cell>
            <Table.Cell>{formatDate(application.actualStartDate)}</Table.Cell>
            <Table.Cell>{application.discipline}</Table.Cell>
            <Table.Cell>{application.applicantType}</Table.Cell>
            <Table.Cell>{application.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default ApplicationTable;
