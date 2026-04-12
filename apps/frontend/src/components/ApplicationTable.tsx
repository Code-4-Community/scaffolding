import { Table } from '@chakra-ui/react';
import StatusPill, { StatusPillConfig, StatusVariant } from './StatusPill';

const COLUMNS = [
  'Name',
  'Proposed Date',
  'Actual Start Date',
  'Discipline',
  'Discipline Admin Name',
  'Status',
];

const APPLICATIONS = [
  {
    id: '1',
    name: 'Firstname Lastname',
    proposedDate: '01-01-2026',
    actualStartDate: '01-07-2026',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'submitted',
  },
  {
    id: '2',
    name: 'Firstname Lastname',
    proposedDate: '01-01-2026',
    actualStartDate: '01-06-2026',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'review',
  },
  {
    id: '3',
    name: 'Firstname Lastname',
    proposedDate: '01-01-2026',
    actualStartDate: '01-05-2026',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'accepted',
  },
  {
    id: '4',
    name: 'Firstname Lastname',
    proposedDate: '01-01-2026',
    actualStartDate: '01-03-2026',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'accepted',
  },
  {
    id: '5',
    name: 'Firstname Lastname',
    proposedDate: '01-01-2026',
    actualStartDate: '01-02-2026',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'inactive',
  },
];

interface ApplicationTableProps {
  searchQuery?: string;
}

export function ApplicationTable({ searchQuery = '' }: ApplicationTableProps) {
  const filteredApplications = APPLICATIONS.filter((application) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      application.name.toLowerCase().includes(query) ||
      application.discipline.toLowerCase().includes(query) ||
      application.disciplineAdminName.toLowerCase().includes(query) ||
      application.status.toLowerCase().includes(query)
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
          <Table.Row key={application.id}>
            <Table.Cell>{application.name}</Table.Cell>
            <Table.Cell>{application.proposedDate}</Table.Cell>
            <Table.Cell>{application.actualStartDate}</Table.Cell>
            <Table.Cell>{application.discipline}</Table.Cell>
            <Table.Cell>{application.disciplineAdminName}</Table.Cell>
            <Table.Cell>
              <StatusPill variant={application.status as StatusVariant}>
                {StatusPillConfig[application.status as StatusVariant].label}
              </StatusPill>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default ApplicationTable;
