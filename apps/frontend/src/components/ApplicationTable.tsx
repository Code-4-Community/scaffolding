import React from 'react';
import { Table } from '@chakra-ui/react';

const COLUMNS = [
  'Name',
  'Start Date',
  'Experience Type',
  'Discipline',
  'Discipline Admin Name',
  'Status',
];

const APPLICATIONS = [
  {
    id: '1',
    name: 'Firstname Lastname',
    startDate: '01-01-2026',
    experienceType: 'Volunteer',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'Approved',
  },
  {
    id: '2',
    name: 'Firstname Lastname',
    startDate: '01-01-2026',
    experienceType: 'Volunteer',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'Approved',
  },
  {
    id: '3',
    name: 'Firstname Lastname',
    startDate: '01-01-2026',
    experienceType: 'Volunteer',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'Approved',
  },
  {
    id: '4',
    name: 'Firstname Lastname',
    startDate: '01-01-2026',
    experienceType: 'Volunteer',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'Approved',
  },
  {
    id: '5',
    name: 'Firstname Lastname',
    startDate: '01-01-2026',
    experienceType: 'Volunteer',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'Approved',
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
      application.status.toLowerCase().includes(query) ||
      application.experienceType.toLowerCase().includes(query)
    );
  });

  return (
    <Table.Root striped stickyHeader>
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
            <Table.Cell>{application.startDate}</Table.Cell>
            <Table.Cell>{application.experienceType}</Table.Cell>
            <Table.Cell>{application.discipline}</Table.Cell>
            <Table.Cell>{application.disciplineAdminName}</Table.Cell>
            <Table.Cell>{application.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default ApplicationTable;
