import * as path from "path";
import Datastore from "nedb";

export interface IContact {
  _id?: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export class Worker {
  private db: Nedb;
  constructor() {
    this.db = new Datastore({
      filename: path.join(__dirname, "contacts.db"),
      autoload: true,
    });
  }

  public listContacts(): Promise<IContact[]> {
    return new Promise((inResolve, inReject) => {
      this.db.find({}, (inError: Error, inDocs: IContact[]) => {
        if (inError) {
          inReject(inError);
        } else {
          inResolve(inDocs);
        }
      });
    });
  }

  public addContact(inContact: IContact): Promise<IContact> {
    return new Promise((inResolve, inReject) => {
      this.db.findOne({ email: inContact.email }, (err: Error | null, existingContact: IContact | null) => {
        if (err) {
          inReject(err);
        } else if (existingContact) {
          inReject(new Error("A contact with this email already exists."));
        } else {
          this.db.insert(inContact, (inError: Error | null, inNewDoc: IContact) => {
            if (inError) {
              inReject(inError);
            } else {
              inResolve(inNewDoc);
            }
          });
        }
      });
    });
  }

  public deleteContact(inID: string): Promise<string> {
    return new Promise((inResolve, inReject) => {
      this.db.remove(
        { _id: inID },
        {},
        (inError: Error | null, inNumRemoved: number) => {
          if (inError) {
            inReject(inError);
          } else {
            inResolve("removed!");
          }
        }
      );
    });
  }
}
